const models = require('../models');


async function dumpFeature(payload) {

    return models.features.create(payload);
}

async function fetchFeaturesWithTypeAndName(type, search) {
    let where = ''
    if (search) {
        where = ` and value ilike '%${search}%' `
    }
    return models.sequelize.query(`select * from features where type = :type and status = :status ${where}`, {
      replacements: { type, status: 'active'},
      type: models.sequelize.QueryTypes.SELECT
    });
  
  }

async function checkIfFeatureAlreadyExist(type, value) {
return models.sequelize.query(`select * from features where type = :type and status = :status and lower(value) = '${value.toLowerCase()}'`, {
    replacements: { type, status: 'active'},
    type: models.sequelize.QueryTypes.SELECT
});

}

  module.exports = { dumpFeature, fetchFeaturesWithTypeAndName, checkIfFeatureAlreadyExist }