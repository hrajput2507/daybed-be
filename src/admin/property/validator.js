const Joi = require('joi');

const Images = Joi.object().keys({
    name: Joi.string().required(),
    url: Joi.string().required(),
});

const createProperty = Joi.object().keys({
    name: Joi.string().required(),
    landlord_id: Joi.number().required(),
    type: Joi.string().valid('apartment', 'townhouse', 'duplex', 'single_family_house'),
    description: Joi.string().required(),
    is_onsite_property_management: Joi.boolean(),
    parking_type: Joi.string().valid('street_parking', 'reserved_spots', 'undercover_secured_parking'),
    amenities: Joi.array().items(Joi.string()),
    images: Joi.array().items(Images)
});

const updateProperty = Joi.object().keys({
    description: Joi.string(),
    is_onsite_property_management: Joi.boolean(),
    parking_type: Joi.string().valid('street_parking', 'reserved_spots', 'undercover_secured_parking'),
    // amenities: Joi.array().items(Joi.string()),
    // images: Joi.array().items(Joi.string())
});

module.exports = { createProperty, updateProperty };