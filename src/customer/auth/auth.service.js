const DB = require("../../../sequelize/db-wrappers");
const { jwtSignedToken } = require("../../../util/helper");

async function getUserByEmail(email) {
  try {
    const user = await DB.users.getUser({ email });
    return user;
  } catch (e) {
    throw e;
  }
}

async function getUserByPhone(phone) {
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

module.exports = { getUserByEmail, generateToken, getUserByPhone };
