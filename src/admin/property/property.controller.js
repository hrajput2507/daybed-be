
const validator = require('./validator');
const service = require('./property.service');
const helper = require('../../../util/helper');
const HttpStatus = require('http-status-codes');

async function getProperties(req, res) {
    try {
      const query = req.query;
      const { limit, offset, pageNum } = helper.limitOffset(query);
      const property = await service.getPropertiesWithUnits(req.query.search, limit, offset);
      return helper.sendResponse({ data: property[0], page: { limit, offset, totalCount: Number(property[1][0].count), pageNum } }, res);
    } catch (e) {
      console.log(e);
      helper.sendServerFailure(res);
    }
}

async function getProperty(req, res) {
  try {
    const { id } = req.params;
    const property = await service.getProperty(id);
    return helper.sendResponse({ data: property }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function updateProperty(req, res) {
  try {

  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function createProperty(req, res) {
  try {
    const joiValidator = validator.createProperty.validate(req.body); 
    if (joiValidator.error) {
      return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
    }
    const validationLandlord = await service.validateLandlord(req.body.landlord_id);
    if (validationLandlord.hasError) return helper.sendResponse(validationLandlord, res);
    const property = await service.dumpProperty({...req.body, created_by: req.userInfo.id });
    return helper.sendResponse({ data: property }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}


module.exports = { getProperties, createProperty, getProperty };