const validator = require('./validator');
const service = require('./features.service');
const helper = require('../../../util/helper');
const HttpStatus = require('http-status-codes');

async function createFeature(req, res) {
    try {
        const joiValidator = validator.common.validate(req.body); 
        if (joiValidator.error) {
          return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
        }
        const feature = await service.dumpFeatures(req.body.type, req.body.value, req.userInfo.id);
        if (feature.hasError) return helper.sendResponse(feature, res);

        return helper.sendResponse({ data: { message: 'Added Successfully'} }, res);

    } catch (e) {
        console.log(e);
        helper.sendServerFailure(res);
      }
}

async function getFeaturesByType(req, res) {
    try {
      
        const joiValidator = validator.get.validate(req.body); 
        if (joiValidator.error) {
          return helper.sendResponse({ hasError: true, message: joiValidator.error.message, status: HttpStatus.StatusCodes.BAD_REQUEST }, res);
        }
        const features = await service.getFeatures(req.body.type, req.body.value);
        return helper.sendResponse({ data: features }, res);

    } catch (e) {
        console.log(e);
        helper.sendServerFailure(res);
      }
}

module.exports = { createFeature, getFeaturesByType };