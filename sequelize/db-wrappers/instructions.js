const models = require('../models');

async function createInstructions(payload) {

    return models.instructions.bulkCreate(payload);
}

async function getInstructions(payload) {
    return models.instructions.findAll({ where: payload });
}

async function updateInstructions(payload, filters) {
    return models.instructions.update(payload, { where: filters })
}

module.exports = { createInstructions, getInstructions, updateInstructions }