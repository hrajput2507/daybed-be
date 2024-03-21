const Joi = require('joi');

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { loginSchema };