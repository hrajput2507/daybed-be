const Joi = require("joi");

const sendEmailOtp = Joi.object().keys({
  email: Joi.string().required(),
});

const verifyEmailOtp = Joi.object().keys({
  otp: Joi.string().required(),
  email: Joi.string().required(),
});

module.exports = { sendEmailOtp, verifyEmailOtp };
