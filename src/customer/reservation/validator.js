const Joi = require("joi");

const getReservationQuote = Joi.object().keys({
  move_in_date: Joi.date().required(),
  entity_type: Joi.string().valid('unit', 'room').required(),
  entity_id: Joi.number().required(),
});

const createReservation = Joi.object().keys({
  move_in_date: Joi.date().required(),
  entity_type: Joi.string().valid('unit', 'room').required(),
  entity_id: Joi.number().required(),
  payment_id: Joi.string().required(),
});


const transfer = Joi.object().keys({
  move_in_date: Joi.date().required(),
  move_out_date: Joi.date().required(),
  entity_type: Joi.string().valid('unit', 'room').required(),
  old_entity_type: Joi.string().valid('unit', 'room').required(),
  entity_id: Joi.number().required(),
  old_entity_id: Joi.number().required(),
});

const getEntityDetail = Joi.object().keys({
  entity_type: Joi.string().valid('unit', 'room').required(),
  entity_id: Joi.number().required()
});


const cancelReservation = Joi.object().keys({
  entity_type: Joi.string().valid('unit', 'room').required(),
  entity_id: Joi.number().required(),
  cancellationReason : Joi.string().optional(),
  remarks :  Joi.string().optional(),
  userId : Joi.number().required()

});

const updateReservationProgressToCompleted = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = { getReservationQuote, createReservation ,transfer , getEntityDetail , cancelReservation ,updateReservationProgressToCompleted}