const Joi = require('joi');

const common = Joi.object().keys({
    type: Joi.string().valid('property', 'room', 'unit', 'parking').required(),
    value: Joi.string().required(),
});

const get = Joi.object().keys({
    type: Joi.string().valid('property', 'room', 'unit', 'parking').required(),
    value: Joi.string().allow('').optional()
});


module.exports = { common, get };