const models = require('../models');

async function createAudit(payload) {

    return models.reservation_audits.create(payload);
}

module.exports = { createAudit }