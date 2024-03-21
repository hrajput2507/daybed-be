const DB = require("../../sequelize/db-wrappers");
const { jwtSignedToken } = require("../../util/helper");

async function createCustomer(payload) {
  return DB.users.createUser(payload);
}

async function getCustomerProfile(payload) {
  return DB.users.getUser(payload);
}

async function updateCustomerProfile(payload, whereClause) {
  return DB.users.updateUser(payload, whereClause);
}

async function getCustomerByPhone(phone) {
  try {
    const user = await DB.users.getUser({ phone });
    return user;
  } catch (e) {
    throw e;
  }
}

async function generateToken(user) {
  const authToken = jwtSignedToken({ id: user.id });
  return {
    token: authToken,
  };
}

module.exports = {
  createCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  generateToken,
  getCustomerByPhone,
};
