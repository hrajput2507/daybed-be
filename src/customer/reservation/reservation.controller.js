const validator = require("./validator");
const service = require("./reservation.service");
const HttpStatus = require("http-status-codes");
const helper = require("../../../util/helper");

async function getReservationQuote(req, res) {
  try {

    const joiValidator = validator.getReservationQuote.validate(req.body);
    if (joiValidator.error) {
      return helper.sendResponse(
        {
          hasError: true,
          message: joiValidator.error.message,
          status: HttpStatus.StatusCodes.BAD_REQUEST,
        },
        res
      );
    }
    const result = await service.getQuote(req.body, req.userInfo.id);
    return helper.sendResponse({ user: result }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function createReservation(req, res) {
  console.log("🚀 ~ file: reservation.controller.js:29 ~ createReservation ~ req:", req.userInfo)
  try {

    const joiValidator = validator.createReservation.validate(req.body);
    if (joiValidator.error) {
      return helper.sendResponse(
        {
          hasError: true,
          message: joiValidator.error.message,
          status: HttpStatus.StatusCodes.BAD_REQUEST,
        },
        res
      );
    }
    const result = await service.createReservation(req.body, req.userInfo);
    return helper.sendResponse({ reservation: result }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function createTransferReservation(req, res) {
  try {

    const joiValidator = validator.transfer.validate(req.body);
    if (joiValidator.error) {
      return helper.sendResponse(
        {
          hasError: true,
          message: joiValidator.error.message,
          status: HttpStatus.StatusCodes.BAD_REQUEST,
        },
        res
      );
    }
    const {old_entity_id  , old_entity_type, entity_id , entity_type , move_out_date , move_in_date  } = req.body;
    const result = await service.createTransferReservation(old_entity_id  , old_entity_type, entity_id , entity_type , move_out_date , move_in_date , req.userInfo);
    return helper.sendResponse({ reservation: result }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

  async function getEntityDetail(req, res) {
    try {
  
      const joiValidator = validator.getEntityDetail.validate(req.query);
      if (joiValidator.error) {
        return helper.sendResponse(
          {
            hasError: true,
            message: joiValidator.error.message,
            status: HttpStatus.StatusCodes.BAD_REQUEST,
          },
          res
        );
      }
      const { entity_id  , entity_type} = req.query;
      const result = await service.getEntityDetail(entity_id , entity_type);
      return helper.sendResponse({ reservation: result }, res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
}


async function cancelReservation(req, res) {
  try {

    const joiValidator = validator.cancelReservation.validate(req.body);
    if (joiValidator.error) {
      return helper.sendResponse(
        {
          hasError: true,
          message: joiValidator.error.message,
          status: HttpStatus.StatusCodes.BAD_REQUEST,
        },
        res
      );
    }
    const result = await service.cancelReservation(req.body);
    return helper.sendResponse({ reservation: result }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}
async function updateReservationProgressToCompleted(req, res)
{
   try {
     const joiValidator = validator.updateReservationProgressToCompleted.validate(req.body); 
     if (joiValidator.error) {
       return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
     }
     const data = await service.updateReservationProgressToCompleted(req.body.id);
     return helper.sendResponse(data , res);
   } catch (e) {
     console.log(e);
     helper.sendServerFailure(res);
   }
 }

module.exports = { getReservationQuote, createReservation, createTransferReservation ,getEntityDetail , cancelReservation ,updateReservationProgressToCompleted};