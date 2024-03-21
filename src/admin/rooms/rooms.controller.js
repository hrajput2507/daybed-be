

const validator = require('./validator');
const service = require('./rooms.service');
const helper = require('../../../util/helper');
const HttpStatus = require('http-status-codes');
const DB = require('../../../sequelize/db-wrappers');

async function createRooms(req, res) {
    try {
      const joiValidator = validator.roomSchema.validate(req.body); 
      if (joiValidator.error) {
        return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
      }

      const validationData = await service.validateUnit(req.body.unit_id);
      if (validationData.hasError) return helper.sendResponse(validationData, res);
      const rooms = req.body.rooms;
      if (validationData.unit.bedroom_count !== rooms.length) {
        return helper.sendResponse({ hasError: true, message: 'Room Count should Match Unit Rooms Count', status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
      }
      rooms.forEach(room => {
        room.unit_id = validationData.unit.id,
        room.property_id = validationData.unit.property_id,
        room.created_by = req.userInfo.id
      });
      const roomdump = await service.createRooms(rooms);
      return helper.sendResponse({ data: roomdump }, res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
  }

  async function createMetaData(req, res) {
    try {
        const joiValidator = validator.metaSchema.validate(req.body); 
        if (joiValidator.error) {
          return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
        }
        const validationData = await service.validateUnit(req.body.unit_id);
        if (validationData.hasError) return helper.sendResponse(validationData, res);
        const metaInfo = await service.dumpMetaData(req.body);
        if (metaInfo.hasError) return helper.sendResponse(metaInfo, res);
        return helper.sendResponse({ data: { hasError: false, message: 'Updated Succcess'} }, res);

    } catch (e) {
        console.log(e);
        helper.sendServerFailure(res);
    }
  }

  async function assignParkingSport(req, res) {
    try {
      const joiValidator = validator.parkingSpotSchema.validate(req.body); 
      if (joiValidator.error) {
        return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
      }
      const validationData = await service.validateUnit(req.body.unit_id);
      if (validationData.hasError) return helper.sendResponse(validationData, res);
      const spots = req.body.spots;
      const existingParkingCount = await DB.parking.getParkingsCountByUnitId(req.body.unit_id);
      // if ((validationData.unit.parking_count - existingParkingCount) <= spots.length) {
      //   return helper.sendResponse({ hasError: true, message: 'Invalid Parking Spot Count', status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
      // }
      const parking = await service.dumpParkingSpot(req.body, validationData.unit.type);
      if (parking.hasError) return helper.sendResponse(parking, res);
      return helper.sendResponse({ data: { hasError: false, message: 'Updated Succcess'} }, res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
  }

  async function getRooms(req, res) {
    try {
      const query = req.query;
      const { limit, offset, pageNum } = helper.limitOffset(query);
      const rooms = await service.getRooms({}, limit, offset);
      return helper.sendResponse({ data: rooms.rows, page: { limit, offset, pageNum, totalCount: rooms.count } }, res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
  }


  async function getRoomById(req, res) {
    try {
      const {id } = req.params;
      const unit = await service.getRoomById(id);
      return helper.sendResponse({ data: unit }, res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
  }

  async function updateInstructions(req, res) {
    try {
      const joiValidator = validator.updateInstructions.validate(req.body); 
      if (joiValidator.error) {
        return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
      }
      await service.updateInstructions(req.body)
      return helper.sendResponse({ data: { message: 'Updated Successfully'} }, res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
  }

  async function markUnitRoomVacant(req, res) {
    try {
      const joiValidator = validator.vacantSchema.validate(req.body); 
      if (joiValidator.error) {
        return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
      }
      await service.updateToVacant(req.body)
      return helper.sendResponse({ data: { message: 'Updated Successfully'} }, res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
  }
  module.exports = { createRooms, createMetaData, assignParkingSport, getRooms, getRoomById, updateInstructions, markUnitRoomVacant }