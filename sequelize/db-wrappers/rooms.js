const models = require('../models');


function isEmptyObject(obj){
    return JSON.stringify(obj) === '{}'
}

async function createRooms(payload) {

    return models.rooms.bulkCreate(payload);
}

async function createRoom(payload) {

    return models.rooms.create(payload);
}


async function getRooms(roomsIdArray, unit_id) {
    return models.rooms.count({ where: {
        id: roomsIdArray,
        unit_id
    }})
}

async function getRoomById(roomId) {
    return models.rooms.findOne({
        where: {
            id: roomId
        }
    })
}
async function getRoomsByUnit(unit_id) {
    return models.rooms.findAll({ where: {
        unit_id
    }, raw: true })
}
async function updateRoom(payload, id) {
    return models.rooms.update(payload, { where: { id }})
}

async function updateRoomsByUnitId(payload, id) {
    return models.rooms.update(payload, { where: { unit_id: id }})
}
async function fetchRooms(payload, limit, offset) {

    const filter = {};
    if (limit) filter.limit = limit;
    if (offset) filter.offset = offset;
    filter.order = [['created_at', 'DESC']]
    if (!isEmptyObject(payload)) filter.where = payload;
      return models.rooms.findAndCountAll(filter);
    }
   
    async function fetchRoomWithInstructions(roomId) {

        return models.sequelize.query(`select p.*, array_agg(json_build_object('id', a.id, 'name', a.name, 'url', a.url)) attachment, array_agg(json_build_object('id', u.id, 'name', u.name, 'description', u.description, 'url', u.url)) room_instructions from rooms p left join instructions u on p.id = u.entity_id and u.entity_type = :type and u.status = :status 
        left join attachments a on a.entity_id = p.id and a.entity_type  = :type and a.status = :status 
        where p.id = :roomId group by p.id`, {
          replacements: { roomId, type: 'room', status: 'active' },
          type: models.sequelize.QueryTypes.SELECT
        });
      
    }

    async function fetchRoomWithInstructionsByRoomId(roomId) {
        const query = `
        select
        r.*,
        ins.instructions,
        att.attachment,
        pri.parking_instructions 
    from
        rooms r
    left join (
        select
            i.entity_id ,
            array_agg(json_build_object('id',
            i.id,
            'name',
            i.name,
            'description',
            i.description,
            'url',
            i.url)) instructions
        from
            instructions i
        inner join rooms r
        on
            r.id = i.entity_id
            and i.entity_type = 'room'
            and i.status = 'active'
        group by
            i.entity_id 
        
        ) ins on
        ins.entity_id = r.id
    left join (
        select
            a.entity_id ,
            array_agg(json_build_object('id',
            a.id,
            'name',
            a.name,
            'url',
            a.url)) attachment
        from
            attachments a
        inner join rooms r
        on
            r.id = a.entity_id
            and a.entity_type = 'room'
            and a.status = 'active'
        group by
            a.entity_id 
        
        ) att on
        att.entity_id = r.id 
        left join (
            select json_agg(pu.*) parking_instructions, pu.room_id from ( 
                select
                    p.*,
                    array_agg(json_build_object('id',
                        i.id,
                        'name',
                        i.name,
                        'description',
                        i.description,
                        'url',
                        i.url)) instructions
                from
                    parking p
                join rooms r on
                    p.room_id = r.id and p.type = 'room'
                join instructions i on
                    i.entity_id = p.id and i.entity_type = 'parking'
                group by
                    p.id
                    ) pu group by pu.room_id
            ) pri on
            pri.room_id = r.id
            `;

        return models.sequelize.query(`${query} 
        where r.id = :roomId`, {
          replacements: { roomId, type: 'room', status: 'active' },
          type: models.sequelize.QueryTypes.SELECT
        });
    }

//     async function fetchRoomWithInstructionsByUnitId(unitId) {

//       return models.sequelize.query(`select p.*, array_agg(json_build_object('id', a.id, 'name', a.name, 'url', a.url)) attachment, array_agg(json_build_object('id', u.id, 'name', u.name, 'description', u.description, 'url', u.url)) room_instructions from rooms p left join instructions u on p.id = u.entity_id and u.entity_type = :type and u.status = :status 
//       left join attachments a on a.entity_id = p.id and a.entity_type  = :type and a.status = :status 
//       where p.unit_id = :unitId group by p.id`, {
//         replacements: { unitId, type: 'room', status: 'active' },
//         type: models.sequelize.QueryTypes.SELECT
//       });
    
//   }
module.exports = { createRooms, getRooms, updateRoom, createRoom, getRoomsByUnit, fetchRooms, getRoomById, fetchRoomWithInstructions, fetchRoomWithInstructionsByRoomId, updateRoomsByUnitId }