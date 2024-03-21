
const models = require("../../../sequelize/models/index");
const moment = require('moment');

async function getAllReservationsData(page,pageSize,search,sort ,sortOrder , progress, status, is_deleted) {
  let pageLimit = parseInt(pageSize, 10);
  if (isNaN(pageLimit) || pageLimit <= 0) {
    pageLimit = 10;
  }

  let currentPage = parseInt(page, 10);
  if (isNaN(currentPage) || currentPage <= 0) {
    currentPage = 1;
  }
  is_deleted = is_deleted === undefined ? false : true;

  const offset = (currentPage - 1) * pageLimit;
  const searchCondition = search ? `AND (u."firstName" ILIKE :search OR u."lastName" ILIKE :search)` : '';
  const progressCondition = progress ? `AND res.progress = :progress` : '';
  const statusCondition = status ? `AND res.status = :status` : '';
  const isDeletedCondition = `AND res.is_deleted = :is_deleted`;
  const order = (sort === undefined || sortOrder  === undefined)? [['created_at', 'DESC']] : [[sort, sortOrder]] ;
  const query = `
      SELECT
        res.*,
        u."firstName" AS "firstName",
        u."lastName" AS "lastName",
        u."email" AS "email",
        u."phone" AS "phone",
        prop.name AS "propertyName",
        prop.type AS "propertyType",
        un.id AS "unitId",
        un.unit_num AS "unitNumber",
        un.type AS "unitType",
        r.id AS "roomId",
        r.type AS "roomType"
      FROM
        public.reservations res
        LEFT JOIN public.users u ON res.created_by = u.id
        LEFT JOIN public.property prop ON res.property_id = prop.id
        LEFT JOIN public.units un ON res.unit_id = un.id
        LEFT JOIN public.rooms r ON res.room_id = r.id
      WHERE
        1=1
        ${searchCondition}
      ${progressCondition}
      ${statusCondition}
      ${isDeletedCondition}
      ORDER BY
      ${order.map(([col, dir]) => `"${col}" ${dir}`).join(', ')}
      LIMIT :pageLimit OFFSET :offset
    `;

  const replacements = {
    search: `%${search}%`,
    progress,
    status,
    is_deleted,
    pageLimit,
    offset,
  };

  const reservationsData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    replacements: replacements
  });

  const countQuery = `
      SELECT COUNT(*) FROM public.reservations res
      LEFT JOIN public.users u ON res.created_by = u.id
      WHERE 1=1 
      ${searchCondition}
      ${progressCondition}
      ${statusCondition}
      ${isDeletedCondition}
    `;

  const countResult = await models.sequelize.query(countQuery, {
    type: models.sequelize.QueryTypes.SELECT,
    replacements: replacements
  });

  const total = parseInt(countResult[0].count, 10);
  const totalPages = Math.ceil(total / pageLimit);

  return {
    data: reservationsData,
    total: total,
    totalPages: totalPages,
    currentPage,
    pageLimit
  };
}

async function approveReservationById(reservationId) {
  const transaction = await models.sequelize.transaction();

  try {
    const reservationQuery = `
        SELECT * FROM public.reservations WHERE id = :reservationId;
      `;
    const reservation = await models.sequelize.query(reservationQuery, {
      type: models.sequelize.QueryTypes.SELECT,
      replacements: { reservationId },
      plain: true,
      transaction
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation?.type === 'application') {
      const currentStayQuery = `
        INSERT INTO public."currentStays" ("userId", "reservationId", "propertyId", "unitId", "roomId" ,created_at , updated_at)
        VALUES (:userId, :reservationId, :propertyId, :unitId, :roomId , :created_at , :updated_at)
        RETURNING *; -- Returns the newly created currentStay
      `;
      const newCurrentStay = await models.sequelize.query(currentStayQuery, {
        type: models.sequelize.QueryTypes.INSERT,
        replacements: {
          userId: reservation.created_by,
          reservationId: reservation.id,
          propertyId: reservation.property_id,
          unitId: reservation.unit_id,
          roomId: reservation.room_id,
          created_at: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
          updated_at: moment().format('YYYY-MM-DDTHH:mm:ssZ')
        },
        transaction
      });


      const updateReservationQuery = `
        UPDATE public.reservations
        SET status = 'approved'
        WHERE id = :reservationId
        RETURNING *; 
      `;
      const result = await models.sequelize.query(updateReservationQuery, {
        type: models.sequelize.QueryTypes.UPDATE,
        replacements: { reservationId },
        transaction
      });


      await transaction.commit();

      return {
        message: "Approved successfully"
      };
    }

    if (reservation?.type === 'transfer') {
      //made currentStay moved
      const updateCurrentStayQuery = `
        UPDATE public."currentStays"
        SET status = 'moved'
        WHERE "userId" = :user_id AND status = 'staying'
        RETURNING *; 
      `;
      await models.sequelize.query(updateCurrentStayQuery, {
        type: models.sequelize.QueryTypes.UPDATE,
        replacements: { user_id: reservation.created_by },
        transaction
      });

      if (reservation?.old_entity_type === 'room');
      {
        const updateRoomQuery = `
        UPDATE public.rooms
        SET room_status = 'vacant'
        WHERE id = :room_id AND room_status = 'occupied'
        RETURNING *; 
      `;
        await models.sequelize.query(updateRoomQuery, {
          type: models.sequelize.QueryTypes.UPDATE,
          replacements: { room_id: reservation?.old_entity_id },
          transaction
        });
      }
      if (reservation?.old_entity_type === 'unit');
      {
        const updateUnitQuery = `
        UPDATE public.units
        SET unit_status = 'vacant'
        WHERE id = :unit_id AND unit_status = 'occupied'
        RETURNING *; 
      `;
        await models.sequelize.query(updateUnitQuery, {
          type: models.sequelize.QueryTypes.UPDATE,
          replacements: { unit_id: reservation?.old_entity_id },
          transaction
        });

      }

      const currentStayQuery = `
        INSERT INTO public."currentStays" ("userId", "reservationId", "propertyId", "unitId", "roomId" ,created_at , updated_at)
        VALUES (:userId, :reservationId, :propertyId, :unitId, :roomId , :created_at , :updated_at)
        RETURNING *; -- Returns the newly created currentStay
      `;
      const newCurrentStay = await models.sequelize.query(currentStayQuery, {
        type: models.sequelize.QueryTypes.INSERT,
        replacements: {
          userId: reservation.created_by,
          reservationId: reservation.id,
          propertyId: reservation.property_id,
          unitId: reservation.unit_id,
          roomId: reservation.room_id,
          created_at: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
          updated_at: moment().format('YYYY-MM-DDTHH:mm:ssZ')
        },
        transaction
      });

      const updateReservationQuery = `
        UPDATE public.reservations
        SET status = 'approved'
        WHERE id = :reservationId
        RETURNING *; 
      `;
      const result = await models.sequelize.query(updateReservationQuery, {
        type: models.sequelize.QueryTypes.UPDATE,
        replacements: { reservationId },
        transaction
      });

      await transaction.commit();

      return {
        message: "Approved successfully"
      };
    }

    if (reservation?.type === 'cancellation') {
      const updateCurrentStayQuery = `
      UPDATE public."currentStays"
        SET status = 'moved'
        WHERE "userId" = :user_id AND status = 'staying'
        RETURNING *; 
    `;
      await models.sequelize.query(updateCurrentStayQuery, {
        type: models.sequelize.QueryTypes.UPDATE,
        replacements: { user_id: reservation.created_by },
        transaction
      });

      if (reservation?.room_id && reservation?.unit_id) {
        const updateRoomQuery = `
      UPDATE public.rooms
      SET room_status = 'vacant'
      WHERE id = :roomId AND room_status = 'occupied'
      RETURNING *; 
    `;
        await models.sequelize.query(updateRoomQuery, {
          type: models.sequelize.QueryTypes.UPDATE,
          replacements: { roomId: reservation?.room_id },
          transaction
        });

        if (!reservation?.room_id && reservation?.unit_id);
        {
          const updateUnitQuery = `
      UPDATE public.units
      SET room_status = 'vacant'
      WHERE id = :unitId AND room_status = 'occupied'
      RETURNING *; 
    `;
          await models.sequelize.query(updateUnitQuery, {
            type: models.sequelize.QueryTypes.UPDATE,
            replacements: { unitId: reservation?.unit_id },
            transaction
          });

        }

        const updateReservationQuery = `
        UPDATE public.reservations
        SET status = 'approved'
        WHERE id = :reservationId
        RETURNING *; 
      `;
        const result = await models.sequelize.query(updateReservationQuery, {
          type: models.sequelize.QueryTypes.UPDATE,
          replacements: { reservationId },
          transaction
        });

        await transaction.commit();

        return {
          message: "Approved successfully"
        };
      }
    }
  } catch (error) {

    await transaction.rollback();
    throw error;
  }
}


async function getReservationById(reservationId) {
  const query = `
    SELECT
      res.*,
      u."firstName" AS "firstName",
      u."lastName" AS "lastName",
      u."email" AS "email",
      u."phone" AS "phone",
      u."passport_url" AS "passport_url",
      u."payslip_url" AS "payslip_url",
      prop."name" AS "propertyName",
      prop."type" AS "propertyType",
      un."id" AS "unitId",
      un."unit_num" AS "unitNumber",
      un."type" AS "unitType",
      r."id" AS "roomId",
      r."type" AS "roomType",
      p."payment_id" AS "payment_id",
      p."payment_status" AS "paymentStatus",
      p."type" AS "paymentType",
      p."total_amount" AS "totalAmount",
      p."created_at" AS "payment_date",
      p."util_price" AS "utilPrice",
      p."base_price" AS "basePrice",
      p."subscription_price" AS "subscriptionPrice"
    FROM
      public."reservations" res
      LEFT JOIN public."users" u ON res."created_by" = u."id"
      LEFT JOIN public."property" prop ON res."property_id" = prop."id"
      LEFT JOIN public."units" un ON res."unit_id" = un."id"
      LEFT JOIN public."rooms" r ON res."room_id" = r."id"
      LEFT JOIN public."payments" p ON p."reservation_id" = res."id"
    WHERE
      res."id" = :reservationId;
  `;


  try {
    const result = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.SELECT,
      replacements: { reservationId },
      plain: true
    });
    return result;
  } catch (error) {
    throw error;
  }
}

async function rejectReservationById(reservationId) {
  const transaction = await models.sequelize.transaction();

  try {
    const rejectReservationQuery = `
      UPDATE reservations
      SET is_deleted = true,
      status = 'declined'
      WHERE id = :reservationId
      RETURNING *; -- Returns the updated reservation
    `;
    const result = await models.sequelize.query(rejectReservationQuery, {
      type: models.sequelize.QueryTypes.UPDATE,
      replacements: { reservationId },
      transaction
    });

    await transaction.commit();

    return {
      message: "Reservation rejected successfully",
      reservation: result[0][0]
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}




module.exports = { getAllReservationsData, approveReservationById, getReservationById, rejectReservationById }