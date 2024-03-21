const { RoboMaker } = require('aws-sdk');
const DB = require('../../../sequelize/db-wrappers')
const HttpStatus = require("http-status-codes");
const moment = require('moment');
const { warn } = require('winston');
const models = require('../../../sequelize/models/index');

async function getQuote(data, userId) {
    const { entity_type, entity_id, move_in_date } = data;
    if (entity_type === 'unit') {
        const unit = await DB.units.fetchUnitsWithInstructions(entity_id);
        const unitDetails = unit[0];
        if (!unitDetails || unitDetails.type !== 'entire' || unitDetails.unit_status !== 'vacant') {
            return { hasError: true, message: 'Unit is Not Vacant(Or its shared Unit)', status: HttpStatus.StatusCodes.BAD_REQUEST }
        }
        const rooms = await DB.rooms.fetchRoomWithInstructionsByUnitId(entity_id);
        const property = await DB.property.fetchPropertyWithInstructions(unit[0].property_id);

        const basePrice = unitDetails.base_price;
        const utilPrice = unitDetails.util_price;
        const daysInMonths = moment(move_in_date, "YYYY-MM-DD").daysInMonth();
        const dayOfMonth = moment(move_in_date, "YYYY-MM-DD").date();
        const proDataUtilPrice = (((utilPrice) * (daysInMonths - dayOfMonth + 1)) / daysInMonths).toFixed(2);
        const proDataBasePrice = (((basePrice) * (daysInMonths - dayOfMonth + 1)) / daysInMonths).toFixed(2);
        const user = await DB.users.getUser({
            id: userId,
        })
        const { membership_end_date } = user;
        let membershipFeesRequired = false;
        if (!membership_end_date) membershipFeesRequired = true;
        if (membership_end_date && moment(membership_end_date, 'YYYY-MM-DD').isBefore(moment().format('YYYY-MM-DD'))) {
            membershipFeesRequired = true;
        }
        return {
            entity_id,
            entity_type,
            unit: unit[0],
            rooms,
            property: property[0],
            proDataUtilPrice,
            proDataBasePrice,
            memberShipFees: membershipFeesRequired ? 499.9 : 0,
            basePrice,
            utilPrice
        }
    }

    if (entity_type === 'room') {
        const rooms = await DB.rooms.fetchRoomWithInstructions(entity_id);
        const roomDetails = rooms[0];
        if (!roomDetails || roomDetails.room_status !== 'vacant') {
            return { hasError: true, message: 'Room is not Vacant', status: HttpStatus.StatusCodes.BAD_REQUEST }
        }
        const unit = await DB.units.fetchUnitsWithInstructions(rooms[0].unit_id);
        const unitDetails = unit[0];
        if (!unitDetails || unitDetails.type !== 'shared' || ['occupied', 'turnover'].includes(unitDetails.unit_status)) {
            return { hasError: true, message: 'Room belong to Entire Type Unit', status: HttpStatus.StatusCodes.BAD_REQUEST }
        }

        const basePrice = roomDetails.base_price;
        const utilPrice = roomDetails.util_price;
        const daysInMonths = moment(move_in_date, "YYYY-MM-DD").daysInMonth();
        const dayOfMonth = moment(move_in_date, "YYYY-MM-DD").date();
        const proDataUtilPrice = (((utilPrice) * (daysInMonths - dayOfMonth + 1)) / daysInMonths).toFixed(2);
        const proDataBasePrice = (((basePrice) * (daysInMonths - dayOfMonth + 1)) / daysInMonths).toFixed(2);
        const user = await DB.users.getUser({
            id: userId,
        })
        const { membership_end_date, membership_start_date } = user;
        let membershipFeesRequired = false;
        if (!membership_end_date) membershipFeesRequired = true;
        if (membership_end_date && moment(membership_end_date, 'YYYY-MM-DD').isBefore(moment().format('YYYY-MM-DD'))) {
            membershipFeesRequired = true;
        }
        const property = await DB.property.fetchPropertyWithInstructions(unit[0].property_id);
        return {
            entity_id,
            entity_type,
            unit: unit[0],
            rooms,
            property: property[0],
            proDataUtilPrice,
            proDataBasePrice,
            memberShipFees: membershipFeesRequired ? 499.9 : 0,
            basePrice,
            utilPrice,
            membership_end_date,
            membership_start_date
        }

    }
}

async function createReservation(data, user) {
    const userId = user.id
    const getQuoteDetails = await getQuote(data, userId);
    console.log("🚀 ~ file: reservation.service.js:97 ~ createReservation ~ getQuoteDetails:", getQuoteDetails)
    if (getQuoteDetails.hasError) return getQuoteDetails;
    const { entity_type, entity_id, move_in_date, payment_id } = data;
    const reservationData = {
        propertyId: getQuoteDetails.property,
        room: getQuoteDetails.room,
        unit: getQuoteDetails.unit,
        created_by: userId,
        start_date: move_in_date
    };
    const reservationAuditData = {
        created_by: userId,
    }

    const payment = await DB.payments.getPaymentById({ payment_id: payment_id, created_by: userId })
    console.log("🚀 ~ file: reservation.service.js:107 ~ createReservation ~ payment:", payment)

    if (entity_type === 'room') {
        reservationData.property_id = getQuoteDetails.property.id
        reservationData.room_id = entity_id,
            reservationData.unit_id = getQuoteDetails.unit.id;
        await DB.rooms.updateRoom({
            room_status: 'occupied'
        }, entity_id);
        const rooms = await DB.rooms.getRoomsByUnit(getQuoteDetails.unit.id);
        let seemsOccupiedUnit = true;
        rooms.forEach(room => {
            if (room.id !== entity_id && room.room_status !== 'occupied') {
                seemsOccupiedUnit = false;
            }
        });
        let unitStatus = seemsOccupiedUnit ? 'occupied' :
            'partially_occupied';

        await DB.units.updateUnit({
            unit_status: unitStatus
        }, entity_id);
    }

    if (entity_type === 'unit') {
        await DB.units.updateUnit({
            unit_status: 'occupied'
        }, entity_id);
        await DB.rooms.updateRoomsByUnitId(
            {
                unit_status: 'occupied'
            },
            entity_id
        )
        reservationData.unit_id = entity_id,
            reservationData.property_id = getQuoteDetails.property.id
    }

    if (getQuoteDetails.memberShipFees) {
        user.membership_end_date = moment().add(1, 'year').format('YYYY-MM-DD');
        user.membership_payment_id = payment.id;
        if (!getQuoteDetails.membership_start_date) user.membership_start_date = moment().format('YYY-MM-DD');
        await DB.users.updateUser(user, {
            where: {
                id: userId
            }
        });
    }
    const reservation = await DB.reservations.createReservation(reservationData);
    const reservationAudit = await DB.reservationsAudit.createAudit({
        ...reservationAuditData,
        reservation_id: reservation.id
    })

    payment.util_price = getQuoteDetails.proDataUtilPrice
    payment.base_price = getQuoteDetails.proDataBasePrice
    payment.subscription_price = getQuoteDetails.memberShipFees
    payment.reservation_id = reservation.id
    await payment.save(payment)

    return reservation;
    // Assuming Payment is Successful


    // create Reservation
    // CREATE RESREVATION AUDIT
    // CREATE PAYMENT
    // UPDATE USERS IF SUBSCRIPTION
    // UPDATE UNITS
    // UPDATE ROOMS
}

async function createTransferReservation(old_entity_id, old_entity_type, entity_id, entity_type, move_out_date, move_in_date, user) {
    const transaction = await models.sequelize.transaction();

    try {
        const userId = user.id;
        const oldEntityDetailQuery = (old_entity_type === 'unit')
            ? 'SELECT * FROM units WHERE id = :old_entity_id'
            : 'SELECT * FROM rooms WHERE id = :old_entity_id';
        const oldEntityDetail = await models.sequelize.query(oldEntityDetailQuery, {
            type: models.sequelize.QueryTypes.SELECT,
            replacements: { old_entity_id },
            transaction
        });

        if (moment(move_out_date).isAfter(moment(move_in_date))) {
            throw new Error('Move out date should be after move in date');
        }

        const getCurrentStayQuery = `
        SELECT * FROM public."currentStays"
        WHERE "userId" = :userId AND status = 'staying'
        LIMIT 1`;

        const currentStay = await models.sequelize.query(getCurrentStayQuery, {
            type: models.sequelize.QueryTypes.SELECT,
            replacements: { userId },
            transaction
        });

        if (!currentStay[0].length === 0) {
            throw new Error('User is not currently staying in any unit or room.');
        }

        if (old_entity_type === 'room' && currentStay[0].roomId !== old_entity_id) {
            throw new Error('old_entity_id room is not same as currentStay');
        }

        if (old_entity_type === 'unit' && currentStay[0].unitId !== old_entity_id) {
            throw new Error('old_entity_id unit  is not same as currentStay');
        }


        const newEntityDetailQuery = (entity_type === 'unit')
            ? 'SELECT * FROM units WHERE id = :entity_id'
            : 'SELECT * FROM rooms WHERE id = :entity_id';
        const newEntityDetail = await models.sequelize.query(newEntityDetailQuery, {
            type: models.sequelize.QueryTypes.SELECT,
            replacements: { entity_id },
            transaction
        });


        if (old_entity_type == 'unit' && oldEntityDetail[0].unit_status === 'vacant' || old_entity_type == 'room' && oldEntityDetail[0].room_status === 'vacant') {
            throw new Error("Room/Unit should not be vacant before moving out");
        }

        if (entity_type == 'unit' && newEntityDetail[0].unit_status !== 'vacant' || entity_type == 'room' && newEntityDetail[0].room_status !== 'vacant') {
            throw new Error("Room/Unit should be vacant before moving in");
        }

        let columns = ["property_id", "unit_id", "old_entity_id", "old_entity_type", "start_date", "end_date", "created_by", "created_at", "updated_at"];
        let values = [":property_id", ":unit_id", ":old_entity_id", ":old_entity_type", ":start_date", ":end_date", ":userId", ':created_at', ':updated_at'];

        let replacements = {
            property_id: newEntityDetail[0]?.property_id,
            unit_id: entity_type === 'unit' ? newEntityDetail[0].id : newEntityDetail[0].unit_id,
            old_entity_id,
            old_entity_type,
            start_date: move_out_date,
            end_date: move_in_date,
            userId,
            created_at: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
            updated_at: moment().format('YYYY-MM-DDTHH:mm:ssZ')
        }

        if (entity_type === 'room' && newEntityDetail[0]?.id !== undefined) {
            columns.push('room_id');
            values.push(':room');
            replacements.room = newEntityDetail[0].id;
        }

        const transferReservationQuery = `
        INSERT INTO reservations (type, status , ${columns.join(', ')})
        VALUES ('transfer', 'new', ${values.join(', ')})
        RETURNING id;
      `;
        const transferReservation = await models.sequelize.query(transferReservationQuery, {
            type: models.sequelize.QueryTypes.INSERT,
            replacements: replacements,
            transaction
        });


        const { membership_end_date } = user;
        let membershipFeesRequired = false;
        if (!membership_end_date) membershipFeesRequired = true;
        if (membership_end_date && moment(membership_end_date, 'YYYY-MM-DD').isBefore(moment().format('YYYY-MM-DD'))) {
            membershipFeesRequired = true;
        }

        const total_amount = newEntityDetail[0].util_price + newEntityDetail[0].base_price + (membershipFeesRequired === true ? 499 : null);
        const paymentQuery = `
          INSERT INTO public.payments (util_price, base_price, subscription_price, total_amount ,created_by, payment_id, reservation_id , created_at , updated_at)
          VALUES (:util_price, :base_price, :subscription_price, :total_amount, :userId, 'testing', :reservation_id , :created_at , :updated_at)`;
        await models.sequelize.query(paymentQuery, {
            type: models.sequelize.QueryTypes.INSERT,
            replacements: {
                util_price: newEntityDetail[0].util_price,
                base_price: newEntityDetail[0].base_price,
                subscription_price: membershipFeesRequired === true ? 499 : null,
                total_amount,
                userId: user.id,
                reservation_id: transferReservation[0][0].id,
                created_at: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
                updated_at: moment().format('YYYY-MM-DDTHH:mm:ssZ')
            },
            transaction
        });


        await transaction.commit();

        return {
            reservationId: transferReservation[0][0].id
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


async function getEntityDetail(entity_id, entity_type) {
    try {

        const data = (entity_type === 'unit') ? await DB.units.fetchUnitsWithInstructions(entity_id) : await DB.rooms.fetchRoomWithInstructions(entity_id);
        return data;
    }
    catch (error) {
        throw error;
    }
}

async function cancelReservation({ entity_id, entity_type, cancellationReason, remarks, userId }) {
    const transaction = await models.sequelize.transaction();

    try {

        const getOldEntityDetailQuery = (entity_type === 'unit') ?
            'SELECT * FROM public.units WHERE id = :entity_id' :
            'SELECT * FROM public.rooms WHERE id = :entity_id';
        const oldEntityDetail = await models.sequelize.query(getOldEntityDetailQuery, {
            type: models.sequelize.QueryTypes.SELECT,
            replacements: { entity_id },
            transaction
        });

        const getCurrentStayQuery = `
        SELECT * FROM public."CurrentStays"
        WHERE "userId" = :userId AND status = 'staying'
        LIMIT 1`;

        const currentStay = await models.sequelize.query(getCurrentStayQuery, {
            type: models.sequelize.QueryTypes.SELECT,
            replacements: { userId },
            transaction
        });

        if (currentStay[0].length === 0) {
            throw new Error('User is not currently staying in any unit or room.');
        }

        if (entity_type === 'room' && currentStay[0].roomId !== entity_id) {
            throw new Error('old_entity_id room is not same as currentStay');
        }

        if (entity_type === 'unit' && currentStay[0].unitId !== entity_id) {
            throw new Error('old_entity_id unit  is not same as currentStay');
        }

        let columns = ['unit_id', 'property_id', 'created_by', 'start_date', 'created_at', 'updated_at'];
        let values = [':unit', ':propertyId', ':userId', ':date', ':created_at', ':updated_at'];
        let replacements = {
            unit: entity_type === 'unit' ? oldEntityDetail[0].id : oldEntityDetail[0].unit_id,
            propertyId: oldEntityDetail[0]?.property_id,
            userId,
            date: moment().format('YYY-MM-DD'),
            created_at: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
            updated_at: moment().format('YYYY-MM-DDTHH:mm:ssZ')
        };


        if (cancellationReason !== undefined) {
            columns.push('cancellation_reason');
            values.push(':cancellationReason');
            replacements.cancellationReason = cancellationReason;
        }
        if (remarks !== undefined) {
            columns.push('remarks');
            values.push(':remarks');
            replacements.remarks = remarks;
        }
        if (entity_type === 'room' && oldEntityDetail[0]?.id !== undefined) {
            columns.push('room_id');
            values.push(':room');
            replacements.room = oldEntityDetail[0].id;
        }

        // Build the query string
        const query = `
  INSERT INTO public.reservations  ( type , ${columns.join(', ')})
  VALUES ( 'cancellation' , ${values.join(', ')})
  RETURNING id;
`;


        // Execute the query
        const cancellationReservation = await models.sequelize.query(query, {
            type: models.sequelize.QueryTypes.INSERT,
            replacements: replacements,
            transaction
        });


        // Commit transaction
        await transaction.commit();

        return {
            cancellationReservationId: cancellationReservation[0][0].id
        };
    } catch (error) {
        // Rollback transaction in case of error
        await transaction.rollback();
        throw error;
    }

}
async function updateReservationProgressToCompleted(reservationId) {
    try {
        const result = await models.reservations.update(
            {
                progress: 'completed'
            },
            {
                where: {
                    id: reservationId,
                    progress: 'incomplete'
                }
            }
        );
        if (result) return { message: "progress updated sucessfully" }
    } catch (error) {
        throw error;
    }
}



module.exports = { getQuote, createReservation, createTransferReservation, getEntityDetail, cancelReservation, updateReservationProgressToCompleted }
