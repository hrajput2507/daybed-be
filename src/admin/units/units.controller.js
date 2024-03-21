
const validator = require('./validator');
const service = require('./units.service');
const helper = require('../../../util/helper');
const HttpStatus = require('http-status-codes');

async function createUnit(req, res) {
    try {
      const joiValidator = validator.createUnit.validate(req.body); 
      if (joiValidator.error) {
        return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
      }
      const validationData = await service.validateProperty(req.body.property_id);
      if (validationData.hasError) return helper.sendResponse(validationData, res);
      const validationLandlord = await service.validateLandlord(req.body.landlord_id);
      if (validationLandlord.hasError) return helper.sendResponse(validationLandlord, res);
      const unit = await service.dumpUnit({ ...req.body, created_by: req.userInfo.id, unit_status: 'vacant' })
      return helper.sendResponse({ data: unit }, res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
  }
  
  async function getUnits(req, res) {
    try {
      const query = req.query;
      const { limit, offset, pageNum } = helper.limitOffset(query);
      const units = await service.getUnits({}, limit, offset);
      return helper.sendResponse({ data: units.rows, page: { limit, offset, pageNum, totalCount: units.count } }, res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
}

async function getUnit(req, res) {
  try {
    const {id } = req.params;
    const unit = await service.getUnitData(id);
    return helper.sendResponse({ data: unit }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

module.exports = {
    createUnit, getUnits, getUnit
}