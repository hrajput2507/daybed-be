const Joi = require('joi');

const create = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
});

module.exports = { create };