const Joi = require('joi');

const dashboard = Joi.object().keys({
  city: Joi.string().empty().default('sydney'),
});

const listing = Joi.object().keys({
    city: Joi.string().default('sydney'),
    suburb: Joi.string(),
    type: Joi.string().valid('unit', 'room'),
    price: Joi.number(),
    move_in_date: Joi.date(),
    limit: Joi.number(),
    offset: Joi.number(),
});

const getDetails = Joi.object().keys({
    entity_type: Joi.string().valid('unit', 'room'),
    entity_id: Joi.number()
}); 


const getCurrentStayByUserId = Joi.object({
  userId : Joi.number().integer().required()
});

const currentStayValidator = Joi.object({ 
  userId: Joi.number().integer().required(),
  reservationId: Joi.number().integer().required(),
  propertyId: Joi.number().integer().required(),
  unitId: Joi.number().integer().required(),
  roomId: Joi.number().integer().required(),
  status: Joi.string().valid('staying', 'vaccating').optional(),

});


module.exports = { dashboard, listing, getDetails  , getCurrentStayByUserId , currentStayValidator};