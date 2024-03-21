const DB = require('../../../sequelize/db-wrappers');
const HttpStatus = require('http-status-codes');

async function createRooms(payload) {
    const roomData = []
    for (const room of payload) {
        const roomInfo = await DB.rooms.createRoom(room);

          const amenities = room.features;
          const images = room.images;

    if (amenities && amenities.length) {
        const roomInstructions = [];
        amenities.forEach(amenti => {
            const amentiesInstructions = {
                name: amenti,
                entity_id: roomInfo.id,
                entity_type: 'room'
            }
            roomInstructions.push(amentiesInstructions);
        });
        const instruct = await DB.instructions.createInstructions(roomInstructions);
        roomInfo.instructions = instruct;
        
    }
    if (images && images.length) {
        const Images = [];
        images.forEach(image => {
            const imageInfo = {
                entity_id: roomInfo.id,
                entity_type: 'room',
                name: image.name,
                url: image.url,
            };
            Images.push(imageInfo);
        })
        const dbImages = await DB.attachments.createAttachments(Images);
        roomInfo.images = dbImages;

    }
    roomData.push(roomInfo);
    }
    return roomData

}


async function validateUnit(unitId) {
    const unit = await DB.units.fetchUnit({ id: unitId});
    if (!unit) return { hasError: true, message: 'Invalid Unit', status: HttpStatus.StatusCodes.BAD_REQUEST }
    return { hasError: false, unit };
}

async function dumpMetaData(data) {
    const { type, base_price, util_price, availability_date, unit_id, meta } = data;
    if (type === 'entire') {
        const data = {
            type,
            base_price,
            util_price,
            availability_date
        };
        return DB.units.updateUnit(data, unit_id);
    }
    const rooms = meta.map(metaInfo => metaInfo.room_id);
    const isValidRooms = await DB.rooms.getRooms(rooms, unit_id);
    if (isValidRooms !== rooms.length) return { hasError: true, message: 'Invalid Rooms Info', status: HttpStatus.StatusCodes.BAD_REQUEST };
    let total_base_price = 0;
    let total_util_price = 0;
    for (let info of meta) {
        const { base_price, util_price, availability_date, room_id} =  info;
        const data = {
            base_price,
            util_price,
            availability_date
        };
        total_base_price += base_price;
        total_util_price += util_price;
        await DB.rooms.updateRoom(data, room_id);
    }
    return DB.units.updateUnit({ type, base_price: total_base_price, util_price: total_util_price }, unit_id)
    // Add room validation
}

async function dumpParkingSpot(data, type) {
    if (!type) return { hasError: true, message: 'First Define the Parking Type', status: HttpStatus.StatusCodes.BAD_REQUEST };

    if (!type) {
        return { hasError: true, message: 'Please Assign to Type to Unit First', status: HttpStatus.StatusCodes.BAD_REQUEST };
    }
    const { unit_id, spots } = data;
    const rooms = [];
    
    spots.forEach((spot) => {
        if (spot.room_id) rooms.push(spot.room_id);
    });

    if (type === 'entire' && rooms.length) {
        return { hasError: true, message: 'Parking spot cannot be defined with Room for entire unit type', status: HttpStatus.StatusCodes.BAD_REQUEST };
    }

    if (type === 'shared' && rooms.length !== spots.length) {
        return { hasError: true, message: 'Parking spot should be assigned with Room for shared unit type', status: HttpStatus.StatusCodes.BAD_REQUEST };

    }
    for (let spot of spots) {
        const payload = {
            unit_id: unit_id,
            spot_number: spot.spot_number,
            room_id: spot.room_id ? spot.room_id : null,
            type: spot.room_id ? 'room' : 'unit'
        }
        const amenities = spot.parking_acces_items;
        const parkingInfo = await DB.parking.createParking(payload);
        if (amenities && amenities.length) {
            const parkingInstructions = [];
            amenities.forEach(amenti => {
                const amentiesInstructions = {
                    name: amenti,
                    entity_id: parkingInfo.id,
                    entity_type: 'parking'
                }
                parkingInstructions.push(amentiesInstructions);
            });
            await DB.instructions.createInstructions(parkingInstructions); 
        }
    }
    return { hasError: false }
}

async function getRooms(payload, limit, offset) {
    return DB.rooms.fetchRooms(payload, limit, offset);
}

async function getRoomById(roomId) {
    const room = await DB.rooms.fetchRoomWithInstructionsByRoomId(roomId);
    if (room && room[0]) {
        // Memebers data to be added.
        room[0].members = [];
    }
    return room[0];
}

async function updateInstructions(data) {
    const { type, description, id, url = null } = data;
    if (type === 'property') {
        return await DB.instructions.updateInstructions( {
            description, url
        }, {id, entity_type: 'property' })
    }
    if (type === 'unit') {
        return await DB.instructions.updateInstructions( {
            description, url
        }, {id, entity_type: 'unit'})
    }
    if (type === 'room') {
        return await DB.instructions.updateInstructions( {
            description, url
        }, {id, entity_type: 'room' })
    }
    if (type === 'parking') {
        return await DB.instructions.updateInstructions( {
            description, url
        }, {id, entity_type: 'parking' })
    }
}

async function updateToVacant(data) {
    const { entity_id, entity_type } = data;
    if (entity_type === 'unit') {
        await DB.units.updateUnit({
            unit_status: 'vacant'
        }, entity_id);
        await DB.rooms.updateRoomsByUnitId({
            room_status: 'vacant'
        }, entity_id)

    }
    if (entity_type === 'room') {
        const room = await DB.rooms.getRoomById(entity_id);
        await DB.rooms.updateRoom({
            room_status: 'vacant'
        }, entity_id);

        const unit = await DB.units.fetchUnit({
            id: room.unit_id
        })
        if (unit.unit_status === 'turnover') {
            await DB.units.updateUnit({
                unit_status: 'vacant'
            }, room.unit_id);
        }
    }
}
module.exports = { createRooms, validateUnit, dumpMetaData, dumpParkingSpot, getRooms, getRoomById, updateInstructions, updateToVacant }