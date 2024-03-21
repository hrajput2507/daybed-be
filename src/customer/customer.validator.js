const Joi = require("joi");

const createCustomerSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  dateOfBirth: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
});

const updateCustomerSchema = Joi.object().keys({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().optional(),
  dateOfBirth: Joi.string().optional(),
  password: Joi.string().optional(),
  emailAddress: Joi.string().optional(),
});

const sendPhoneOtp = Joi.object().keys({
  phone: Joi.string().required(),
});

const verifyPhoneOtp = Joi.object().keys({
  otp: Joi.string().required(),
  phone: Joi.string().required(),
});

const updateProfileCustomer = Joi.object({
  dateOfBirth: Joi.date().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().min(8).optional() // Assuming a minimum password length of 6 characters
});

const updatePassword = Joi.object({
  newPassword: Joi.string().required().min(8),
  currentPassword:Joi.string().required().min(8)
});

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
  sendPhoneOtp,
  verifyPhoneOtp,
  updateProfileCustomer ,updatePassword
};
