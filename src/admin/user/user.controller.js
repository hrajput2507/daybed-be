const helper = require('../../../util/helper');
const validator = require('./validator');
const service = require('./user.service');
const httpStatus = require('http-status-codes');

async function login(req, res, next) {
  try {
    const joiValidator = validator.loginSchema.validate(req.body);
    if (joiValidator.error) {
      return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: httpStatus.StatusCodes.BAD_REQUEST }, res);
    }
    const result = await service.login(req.body.email, req.body.password);
    return helper.sendResponse(result, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}
module.exports = { login }