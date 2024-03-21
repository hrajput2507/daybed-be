const models = require('../models');


function isEmptyObject(obj){
  return JSON.stringify(obj) === '{}'
}

async function getUnitById(unitId) {
    return models.rooms.findOne({
        where: {
            id: unitId,
        }
    })
}

async function fetchUnits(payload, limit, offset) {

    const filter = {};
    if (limit) filter.limit = limit;
    if (offset) filter.offset = offset;

    filter.order = [['updated_at', 'DESC']]

    if (!isEmptyObject(payload)) filter.where = payload;

  return models.units.findAndCountAll(filter);
}

async function fetchUnit(payload) {

    return models.units.findOne({ where: payload });
  }

async function dumpUnit(payload) {

    return models.units.create(payload);
}

async function updateUnit(payload, id) {
    return models.units.update(payload, { where: { id }})
}

async function fetchUnitsByPropertyId(propertyId) {
  return models.units.findAll({ where: { property_id: propertyId },  raw: true})
}

async function fetchUnitsByLandlordId(landlord_id) {
  return models.units.findAll({ where: { landlord_id },  raw: true})
}

async function fetchUnitsWithInstructions(propertyId) {

  return models.sequelize.query(`select p.*, array_agg(json_build_object('id', a.id, 'name', a.name, 'url', a.url)) attachment, array_agg(json_build_object('id', u.id, 'name', u.name, 'description', u.description, 'url', u.url)) units_instructions from units p left join instructions u on p.id = u.entity_id and u.entity_type = :type and u.status = :status  
  left join attachments a on a.entity_id = p.id and a.entity_type  = :type and a.status = :status where p.id = :propertyId group by p.id`, {
    replacements: { propertyId, type: 'unit', status: 'active' },
    type: models.sequelize.QueryTypes.SELECT
  });

}

async function fetchUnitById(unitId) {
  const query = `
  select
	u.*,
	ins.instructions,
	att.attachment,
	pui.parking_instructions
from
	units u
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
	inner join units u
	on
		u.id = i.entity_id
		and i.entity_type = 'unit'
		and i.status = 'active'
	group by
		i.entity_id 
	
	) ins on
	ins.entity_id = u.id
left join (
	select json_agg(pu.*) as parking_instructions, pu.unit_id from ( 
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
		join units u on
			p.unit_id = u.id and p.type = 'unit' 
		join instructions i on
			i.entity_id = p.id and i.entity_type = 'parking' 
		group by
			p.id
			) pu group by pu.unit_id
	) pui on
	pui.unit_id = u.id
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
	inner join units u 
	on
		u.id = a.entity_id
		and a.entity_type = 'unit'
		and a.status = 'active'
	group by
		a.entity_id 
	
	) att on
	att.entity_id = u.id `;

  return models.sequelize.query(`${query} where u.id = :unitId `, {
    replacements: { unitId, type: 'unit', status: 'active' },
    type: models.sequelize.QueryTypes.SELECT
  });
}
async function getUnitCountByLandlordId(landlord_id) {
  return models.units.count({ where: {
    landlord_id
}})
}

async function getDashboardListing(query) {
  return models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT
  });
}

async function getAllWithoutClause(where) {
    return models.units.findAll({ where });
}


module.exports = {
    fetchUnits,
    fetchUnit,
    dumpUnit,
    updateUnit,
    fetchUnitsByPropertyId,
    fetchUnitsWithInstructions,
    getUnitCountByLandlordId,
    fetchUnitsByLandlordId,
    getDashboardListing,
    fetchUnitById,
	getAllWithoutClause,
	getUnitById
}