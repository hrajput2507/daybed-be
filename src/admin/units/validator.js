const Joi = require('joi');

const Images = Joi.object().keys({
    name: Joi.string().required(),
    url: Joi.string().required(),
});

const createUnit = Joi.object().keys({
    property_id: Joi.number().required(),
    ownership_status: Joi.string().valid('owned', 'leased').required(),
    street_address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    suburb: Joi.string().required(),
    postcode: Joi.string().required(),
    area_description: Joi.string().required(),
    unit_num: Joi.string().required(),
    floor_level: Joi.number().required(),
    bedroom_count: Joi.number().required(),
    max_occupants: Joi.number().required(),
    area_sqm: Joi.number().required(),
    description: Joi.string().required(),
    furnished_unit: Joi.boolean(),
    features: Joi.array().items(Joi.string()),
    images: Joi.array().items(Images),
    landlord_id: Joi.number().required(),
    bathroom_count: Joi.number().required(),
    parking_count: Joi.number().required(),
    is_pets_accepted: Joi.boolean().required(),
    pet_rent: Joi.alternatives().conditional('is_pets_accepted',
    {
        is: true,
        then: Joi.number().required(),
        otherwise: Joi.forbidden(),
    }),
    minimum_stay_days: Joi.number().required(),
    latitude: Joi.string(),
    longitude: Joi.string(),

});



module.exports = { createUnit };