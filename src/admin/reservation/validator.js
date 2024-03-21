const Joi = require('joi');


const getAllReservationsData = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).default(10),
    search: Joi.string().allow('', null),
    sort: Joi.string().valid('created_at', 'amount').default('created_at'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
    progress : Joi.string().valid('completed', 'incomplete').optional(),
    status: Joi.string().valid('new', 'approved', 'declined').optional(),
    is_deleted : Joi.boolean().default(false)
    
  });
const updateReservationProgressToCompleted = Joi.object({
    id: Joi.number().integer().required()
  });
  const approveReservationById = Joi.object({
    id: Joi.number().integer().required()
  });

  const getReservationById = Joi.object({
    id: Joi.number().integer().required()
  });

  const rejectReservationById = Joi.object({
    id: Joi.number().integer().required()
  });
  

module.exports = { getAllReservationsData , approveReservationById , updateReservationProgressToCompleted , getReservationById , rejectReservationById}