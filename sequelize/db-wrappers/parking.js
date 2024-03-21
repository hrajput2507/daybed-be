const models = require('../models');

async function createParking(payload) {

    return models.parking.create(payload);
}

async function getParkingsCountByUnitId(unitId) {
    return models.parking.count({
        where: { unit_id: unitId }
    });
}
module.exports = { createParking, getParkingsCountByUnitId };