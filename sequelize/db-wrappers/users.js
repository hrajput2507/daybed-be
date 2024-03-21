const models = require("../models");

async function getUser(payload) {
  return models.users.findOne({ where: payload, raw: true });
}
async function getAllUser(payload) {
  return models.users.findAll(payload);
}
async function count(payload) {
  return models.users.count(payload);
}

async function createUser(payload) {
  return models.users.create(payload);
}

async function updateUser(payload, whereClause) {
  return models.users.update(payload, whereClause);
}
module.exports = {
  getUser,
  createUser,
  updateUser,
  getAllUser
};
