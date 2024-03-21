const models = require('../models');

async function createReservation(payload) {

    return models.reservations.create(payload);
}

module.exports = { createReservation }