const validator = require('./validator')
const service = require('./reservation.service');
const helper = require('../../../util/helper');
const HttpStatus = require('http-status-codes');



async function getAllReservationsData(req, res) {
  try {
    const joiValidator = validator.getAllReservationsData.validate(req.query);
    if (joiValidator.error) {
      return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
    }
    const {page,pageSize,search,sort ,sortOrder , progress, status, is_deleted} = req.query;
    const data = await service.getAllReservationsData(page,pageSize,search,sort ,sortOrder , progress, status, is_deleted);
    return helper.sendResponse(data, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function approveReservationById(req, res) {
  try {
    const joiValidator = validator.approveReservationById.validate(req.body);
    if (joiValidator.error) {
      return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
    }
    const data = await service.approveReservationById(req.body.id);
    return helper.sendResponse(data, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function getReservationById(req, res) {
  try {
    const joiValidator = validator.getReservationById.validate(req.query);
    if (joiValidator.error) {
      return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
    }
    const data = await service.getReservationById(req.query.id);
    return helper.sendResponse(data, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function rejectReservationById(req, res) {
  try {
    const joiValidator = validator.rejectReservationById.validate(req.query);
    if (joiValidator.error) {
      return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
    }
    const data = await service.rejectReservationById(req.query.id);
    return helper.sendResponse(data, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}


module.exports = { getAllReservationsData, approveReservationById , getReservationById , rejectReservationById}