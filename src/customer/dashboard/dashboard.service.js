const queries = require('./query');
const DB = require('../../../sequelize/db-wrappers')
const models = require("../../../sequelize/models/index")

async function getDashboardData(payload, limit = 6, offset = 0) {
  const query = queries.dashboardQuery(payload, limit, offset);
  const countQuery = queries.countQuery(payload);
  return await Promise.all([DB.units.getDashboardListing(query), DB.units.getDashboardListing(countQuery)]);
}

async function getDetails(payload) {
  const { entity_type, entity_id } = payload;
  if (entity_type === 'unit') {
    const unit = await DB.units.fetchUnitById(entity_id);
    const rooms = await DB.rooms.fetchRoomWithInstructionsByRoomId(entity_id);
    const property = await DB.property.fetchPropertyWithInstructions(unit[0].property_id);
    return {
      entity_id,
      entity_type,
      unit: unit[0],
      rooms,
      property: property[0]
    }
  }

  if (entity_type === 'room') {
    const rooms = await DB.rooms.fetchRoomWithInstructionsByRoomId(entity_id);
    const unit = await DB.units.fetchUnitById(rooms[0].unit_id);
    const property = await DB.property.fetchPropertyWithInstructions(unit[0].property_id);
    return {
      entity_id,
      entity_type,
      unit: unit[0],
      rooms,
      property: property[0]
    }

  }
}

async function getCurrentStayByUserId(userId) {
  try {
    const query = `
    SELECT
    cs.*,
    u."firstName" AS "firstName",
    u."lastName" AS "lastName",
    res.status AS "reservationStatus",
    res.start_date AS "start_date",
    prop.name AS "propertyName",
    prop.type AS "propertyType",
    un.id AS "unitId",
    un.street_address AS "street_address",
    un.city AS "city",
    un.state AS "state",
    un.postcode AS "postcode",
    un.latitude AS "latitude",
    un.longitude AS "longitude",
    un.base_price AS "unit_base_price",
    r.id AS "roomId",
    r.type AS "room_type",
    r.base_price AS "room_base_price",
    r.util_price AS "room_utils_price",
    img.url AS "img_url",
    img.entity_type AS "entity_type"
  FROM
    public."currentStays" cs
    LEFT JOIN public.users u ON cs."userId" = u.id
    LEFT JOIN public.reservations res ON cs."reservationId" = res.id AND res.status = 'approved'
    LEFT JOIN public.property prop ON res."property_id" = prop.id
    LEFT JOIN public.units un ON res."unit_id" = un.id
    LEFT JOIN public.rooms r ON res."room_id" = r.id
    LEFT JOIN public.attachments img ON img.entity_id = res."room_id" AND img.entity_type = 'room' OR img.entity_id = res."unit_id" AND img.entity_type = 'unit'
  WHERE
    cs."userId" = :userId
  LIMIT 1;
    `;


    const currentStayData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.SELECT,
      replacements: { userId },
      plain: true
    });

    return currentStayData;
  }
  catch (error) {
    throw error;
  }
}






module.exports = { getDashboardData, getDetails, getCurrentStayByUserId }