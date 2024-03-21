// suburb: Joi.string(),

function dashboardQuery(payload, limit = 6, offset = 0) {
	let where = '';
	where = `where city ilike '%${payload['city']}%'`
	if (payload['suburb']) {
		where = ` ${where} and suburb ilike '%${payload['suburb']}%'`
	}
	if (payload) {
		for (let attribute in payload) {
      if (attribute === 'move_in_date' || attribute === 'limit' || attribute === 'offset' || attribute === 'city' || attribute === 'suburb') continue;
      let comparator = '=';
      if (attribute === 'price') comparator = '<=';
      where = where ? `${where} and ${attribute} ${comparator} '${payload[attribute]}'`
      : `where ${attribute} ${comparator} '${payload[attribute]}'`
    }
	}

  const query = `
  with listing as (

    select
	'unit' as "type" ,
  u.id,
	u.unit_status::text ,
	u.street_address ,
	u.city,
	u.state,
	u.suburb,
	u.postcode ,
	u.latitude,
	u.longitude,
	u.area_description ,
	ins.instructions,
	att.attachment,
  u.updated_at,
	u.floor_level ,
	u.bedroom_count ,
	u.bathroom_count ,
	u.parking_count ,
	(u.base_price + u.util_price ) price
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
	att.entity_id = u.id
where
	u.type = 'entire'
	and u.unit_status = 'vacant'
union all
	select
	'room' as "type",
  r.id,
	r.room_status::text ,
	u.street_address ,
	u.city,
	u.state,
	u.suburb,
	u.postcode,
	u.latitude,
	u.longitude,
	u.area_description ,
	ins.instructions,
	att.attachment,
  r.updated_at,
	u.floor_level ,
	u.bedroom_count ,
	u.bathroom_count ,
	u.parking_count ,
	(r.base_price + r.util_price ) price
from
	units u
join rooms r on
	u.id = r.unit_id
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
where
	u.type = 'shared'
	and r.room_status = 'vacant'

  )
  
  select * from listing ${where} order by updated_at desc limit ${limit} offset ${offset}
  `
  return query;
}

function countQuery(payload) {
	let where = '';
	where = `where city ilike '%${payload['city']}%'`
	if (payload['suburb']) {
		where = ` ${where} and suburb ilike '%${payload['suburb']}%'`
	}
	if (payload) {
		for (let attribute in payload) {
		if (attribute === 'move_in_date' || attribute === 'limit' || attribute === 'offset' || attribute === 'city' || attribute === 'suburb') continue;
		let comparator = '=';
      if (attribute === 'price') comparator = '<=';
	  if (attribute === 'city') continue;
      where = where ? `${where} and ${attribute} ${comparator} '${payload[attribute]}'`
      : `where ${attribute} ${comparator} '${payload[attribute]}'`
    }
	}

	const query = `
	with listing as (
  
	  select
	  'unit' as "type" ,
	u.id,
	  u.unit_status::text ,
	  u.street_address ,
	  u.city,
	  u.state,
	  u.suburb,
	  u.postcode ,
	  u.area_description ,
	  ins.instructions,
	  att.attachment,
	u.updated_at,
	  u.floor_level ,
	  u.bedroom_count ,
	  u.bathroom_count ,
	  u.parking_count ,
	  (u.base_price + u.util_price ) price
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
	  att.entity_id = u.id
  where
	  u.type = 'entire'
	  and u.unit_status = 'vacant'
  union all
	  select
	  'room' as "type",
	r.id,
	  r.room_status::text ,
	  u.street_address ,
	  u.city,
	  u.state,
	  u.suburb,
	  u.postcode,
	  u.area_description ,
	  ins.instructions,
	  att.attachment,
	r.updated_at,
	  u.floor_level ,
	  u.bedroom_count ,
	  u.bathroom_count ,
	  u.parking_count ,
	  (r.base_price + r.util_price ) price
  from
	  units u
  join rooms r on
	  u.id = r.unit_id
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
  where
	  u.type = 'shared'
	  and r.room_status = 'vacant'
  
	)
	
	select count(*) from listing ${where} 
	`
	return query;
}
module.exports = { dashboardQuery, countQuery };