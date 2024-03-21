const validator = require('./validator');
const service = require('./dashboard.service');
const helper = require('../../../util/helper');
const HttpStatus = require('http-status-codes');
const models = require("../../../sequelize/models/index")

async function dashboard(req, res) {
  try {
    const joiValidator = validator.dashboard.validate(req.query); 
    if (joiValidator.error) {
      return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
    }
    if (!req.query.city) req.query.city = 'sydney';
    const data = await service.getDashboardData(req.query);
    return helper.sendResponse({ data: data[0] }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function listing(req, res) {
  try {
    const joiValidator = validator.listing.validate(req.query); 
    if (joiValidator.error) {
      return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
    }
    if (!req.query.city) req.query.city = 'sydney';
    const { limit, offset } = helper.limitOffset(req.query);
    const data = await service.getDashboardData(req.query, limit, offset);
    return helper.sendResponse({ data: data[0], page: { limit, offset, totalCount: Number(data[1][0].count) } }, res);
  } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
  } 
}

async function entityDetails(req, res) {
  try {
    const joiValidator = validator.getDetails.validate(req.query); 
    if (joiValidator.error) {
      return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
    }
    const data = await service.getDetails(req.query);
    return helper.sendResponse({ data }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function getCurrentStayByUserId(req, res) {
  try {
    const data = await service.getCurrentStayByUserId(req?.userInfo?.id);
    return helper.sendResponse( data, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function createCurrentStay(req , res) {
 
  const joiValidator = validator.currentStayValidator.validate(req.body); 
  if (joiValidator.error) {
    return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
  }

  try {
    const newCurrentStay = await models.currentStay.create(req.body);
    return newCurrentStay;
  } catch (error) {
    throw error;
  }
}





module.exports = { dashboard, listing, entityDetails , getCurrentStayByUserId ,createCurrentStay };