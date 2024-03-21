const models = require('../models');

function isEmptyObject(obj){
    return JSON.stringify(obj) === '{}'
}

async function fetchproperties(payload, limit, offset) {

const filter = {};
if (limit) filter.limit = limit;
if (offset) filter.offset = offset;
filter.order = [['createdAt', 'DESC']]
if (!isEmptyObject(payload)) filter.where = payload;
  return models.property.findAndCountAll(filter);
}

async function fetchproperty(payload) {

    return models.property.findOne({ where: payload });
  }
  

async function dumpProperty(payload) {

    return models.property.create(payload);
}

async function fetchPropertyWithInstructions(propertyId) {

  return models.sequelize.query(`select p.*, array_agg(json_build_object('id', a.id, 'name', a.name, 'url', a.url)) attachment, array_agg(json_build_object('id', u.id, 'name', u.name, 'description', u.description, 'url', u.url)) property_instructions from property p left join instructions u on p.id = u.entity_id and u.entity_type = :type and u.status = :status 
  left join attachments a on a.entity_id = p.id and a.entity_type  = :type and a.status = :status 
   where p.id = :propertyId group by p.id`, {
    replacements: {propertyId, type: 'property', status: 'active'},
    type: models.sequelize.QueryTypes.SELECT
  });

}

async function getPropertyById(propertyId) {
  const query = `select p.*, ins.instructions,
	att.attachment from property p
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
	inner join property p
	on
		p.id = i.entity_id
		and i.entity_type = 'property'
		and i.status = 'active'
	group by
		i.entity_id 
	
	) ins on
	ins.entity_id = p.id
	
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
	inner join property p 
	on
		p.id = a.entity_id
		and a.entity_type = 'property'
		and a.status = 'active'
	group by
		a.entity_id 
	
	) att on
	att.entity_id = p.id 
   where p.id = ${propertyId} 
	`;

  return models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT
  });
}

async function getPropertiesWithUnits(search, limit, offset) {
  let where = ''
	if (search) {
    where = `where p.name ilike '%${search}%'`
  }


  const query = `
  select
	p.*,
	un.units,
	att.attachment
from
	property p
left join (
	select
		u.property_id ,
		array_agg(json_build_object('id',
		u.id,
		'bed_count',
		u.bedroom_count,
		'unit_number',
		u.unit_num,
		'parking_count',
		u.parking_count,
		'bathroom_count',
		u.bathroom_count,
		'status',
		u.status,
		'occupancy',
		10,
		'type',
		u.type,
		'price',
		u.base_price + u.util_price,
		'unit_status',
		u.unit_status )) as units
	from
		units u
	inner join property p
	on
		p.id = u.property_id
		and u.status = 'active'
	group by
		u.property_id 
	
	) un on
	un.property_id = p.id
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
	inner join property p 
	on
		p.id = a.entity_id
		and a.entity_type = 'property'
		and a.status = 'active'
	group by
		a.entity_id 
	
	) att on
	att.entity_id = p.id
`;


  return models.sequelize.query(`${query} ${where} order by updated_at desc limit :limit offset :offset`, {
    replacements: {limit, offset, status: 'active', type: 'property'},
    type: models.sequelize.QueryTypes.SELECT
  });

	
	
}

async function getPropertiesCountWithSearch(search) {
	let where = ''
	if (search) {
    where = `where p.name ilike '%${search}%'`
  }
  const query = `SELECT COUNT(*) FROM property p `
  return models.sequelize.query(`${query} ${where}`, {
    replacements: { status: 'active' },
    type: models.sequelize.QueryTypes.SELECT
  });
}
module.exports = {
    fetchproperties,
    dumpProperty,
    fetchproperty,
    fetchPropertyWithInstructions,
    getPropertiesWithUnits,
    getPropertyById,
    getPropertiesCountWithSearch,
}