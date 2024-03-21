const Joi = require('joi');

const getAllPaymentsDataValidator = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).default(10),
    search: Joi.string().allow('', null),
    sort: Joi.string().valid('created_at', 'amount').default('created_at'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
    type: Joi.string().valid('Rent', 'Subscription', 'Transfer', 'Cancellation'),
    payment_status: Joi.string().valid('succeeded', 'attached', 'failed',"Created"),
    
  });
  
  const getPaymentByIdValidator = Joi.object({
    id: Joi.number().integer().required()
  });
  
  
  module.exports = {  getPaymentByIdValidator , getAllPaymentsDataValidator};