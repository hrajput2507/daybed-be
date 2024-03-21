const DB = require('../../../sequelize/db-wrappers');
const HttpStatus = require('http-status-codes');

async function dumpFeatures(type, value, created_by) {
  const features = await DB.features.checkIfFeatureAlreadyExist(type, value);
  if (features && features.length) {
    return {
      hasError: true,
      message: 'Feature Already Exist',
      status: HttpStatus.StatusCodes.BAD_REQUEST
    }
  }
  return await DB.features.dumpFeature({
    type,
    value,
    created_by
  })
}

async function getFeatures(type, value) {
  return await DB.features.fetchFeaturesWithTypeAndName(type, value)
}

module.exports = { getFeatures, dumpFeatures }