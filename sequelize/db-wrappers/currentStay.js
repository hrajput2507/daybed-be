const models = require('../models');

async function createCurrentStay(payload) {

    return models.currentStay.create(payload);
}

module.exports = { createCurrentStay }