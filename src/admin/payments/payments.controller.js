const validator = require('./validator')
const service = require('./payments.service');
const helper = require('../../../util/helper');
const HttpStatus = require('http-status-codes');


async function getAllPaymentsData(req, res)
 {
    try {
      const joiValidator = validator.getAllPaymentsDataValidator.validate(req.query); 
      if (joiValidator.error) {
        return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
      }
      const {page, pageSize, search, sort, sortOrder, type, payment_status} = req.query;
      const data = await service.getAllPaymentsData(page, pageSize, search, sort, sortOrder, type, payment_status);
      return helper.sendResponse(data , res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
  }
  
  async function getPaymentById(req, res) {
    try {
      const joiValidator = validator.getPaymentByIdValidator.validate(req?.query); 
      if (joiValidator.error) {
        return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
      }
      const data = await service.getPaymentById(req.query.id);
      return helper.sendResponse({ data }, res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
  }
  
  module.exports = {  getPaymentById , getAllPaymentsData};