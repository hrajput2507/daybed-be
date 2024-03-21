const models = require('../models');

async function createPayment(payload) {

    return models.payments.create(payload);
}
async function getPaymentById(payload) {

    return models.payments.findOne({ where: payload });
}

module.exports = { createPayment, getPaymentById };