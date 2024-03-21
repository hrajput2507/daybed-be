
const models = require("../../../sequelize/models");



async function getAllPaymentsData(page, pageSize, search, sort, sortOrder, type, payment_status) {
  let pageLimit = parseInt(pageSize, 10);
  if (isNaN(pageLimit) || pageLimit <= 0) {
    pageLimit = 10;
  }

  let currentPage = parseInt(page, 10);
  if (isNaN(currentPage) || currentPage <= 0) {
    currentPage = 1;
  }

  const offset = (currentPage - 1) * pageLimit;

  const searchCondition = search ? `AND (u."firstName" ILIKE :search OR u."lastName" ILIKE :search)` : '';
  const typeCondition = type ? `AND p.type = :type` : '';
  const statusCondition = payment_status ? `AND p.payment_status = :payment_status` : '';
  const order = (sort === undefined || sortOrder === undefined) ? [['created_at', 'DESC']] : [[sort, sortOrder]];


  const query = `
  SELECT
      p.*,
      u."firstName" AS "firstName",
      u."lastName" AS "lastName",
      un.id AS "unitId",
      un.unit_num AS "unit_number",
      un.type AS "unit_type" ,
      r.id AS "roomId",
      r.type AS "room_type",
      pr.name As "property_name",
      pr.type As "property_type",
      pr.id As "property_id"
    FROM
      public.payments p
      LEFT JOIN public.reservations res ON p.reservation_id = res.id
      LEFT JOIN public.users u ON res.created_by = u.id
      LEFT JOIN public.units un ON res.unit_id = un.id
      LEFT JOIN public.rooms r ON res.room_id = r.id
      LEFT JOIN public.property pr ON pr.id = un.property_id
    WHERE
      1=1
      ${searchCondition}
      ${typeCondition}
      ${statusCondition}
    ORDER BY
      ${order.map(([col, dir]) => `"${col}" ${dir}`).join(', ')}
    LIMIT :pageLimit OFFSET :offset
  `;


  const replacements = {
    search: `%${search}%`,
    type,
    payment_status,
    pageLimit,
    offset,

  };


  const paymentsData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    replacements: replacements
  });


  const countQuery = `
    SELECT COUNT(*) FROM public.payments p
    LEFT JOIN public.reservations res ON p.reservation_id = res.id
    LEFT JOIN public.users u ON res.created_by = u.id
    WHERE 1=1  
    ${searchCondition}
    ${typeCondition}
    ${statusCondition}
  `;

  const countResult = await models.sequelize.query(countQuery, {
    type: models.sequelize.QueryTypes.SELECT,
    replacements: replacements
  });

  const total = parseInt(countResult[0].count, 10);
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: paymentsData,
    total: total,
    totalPages: totalPages,
    currentPage,
    pageLimit
  };
}


async function getPaymentById(paymentId) {

  const query = `
  SELECT
  p.*,
  u."firstName" AS "firstName",
  u."lastName" AS "lastName",
  un.id AS "unitId",
  un.unit_num AS "unit_number",
  un.type AS "unit_type" ,
  r.id AS "roomId",
  r.type AS "room_type",
  pr.name As "property_name",
  pr.type As "property_type",
  pr.id As "property_id"
FROM
  public.payments p
  LEFT JOIN public.reservations res ON p.reservation_id = res.id
  LEFT JOIN public.users u ON res.created_by = u.id
  LEFT JOIN public.units un ON res.unit_id = un.id
  LEFT JOIN public.rooms r ON res.room_id = r.id
  LEFT JOIN public.property pr ON pr.id = un.property_id
    WHERE
      p.id = :paymentId
  `;


  const paymentData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    replacements: { paymentId },
    plain: true
  });

  return paymentData;
}


module.exports = { getAllPaymentsData, getPaymentById }