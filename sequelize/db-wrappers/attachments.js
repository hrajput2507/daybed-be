const models = require('../models');

async function createAttachments(payload) {

    return models.attachments.bulkCreate(payload);
}

module.exports = { createAttachments }