const DB = require('../../../sequelize/db-wrappers');
const HttpStatus = require('http-status-codes');
const helper = require('../../../util/helper');

async function login(email, password) {
  try {
    const user = await DB.users.getUser({ email });
    if (!user) return { status: HttpStatus.StatusCodes.UNAUTHORIZED, message: 'Invalid Credentials'};
    const passwordMatched = await helper.comparePassword(password, user.password);
    if (!passwordMatched) return { status: HttpStatus.StatusCodes.UNAUTHORIZED, message: 'Invalid Credentials'};
    const authToken = helper.jwtSignedToken({ id: user.id });
    return {
      token: authToken
    }
  } catch (e) {
    throw e;
  }
}

module.exports = {
  login,
}