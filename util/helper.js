const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status-codes");
const DB = require("../sequelize/db-wrappers");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const S3 = new AWS.S3();

async function uploadBase64toS3(base64Image, path) {
  var buf = Buffer.from(
    base64Image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  var data = {
    Bucket: process.env.S3_BUCKET,
    Key: `${path}.jpeg`,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
  };
  const s3_data = await S3.upload(data).promise();
  return s3_data.Location;
}

async function encryptPassword(password) {
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
}

async function comparePassword(inputPassword, hashedPassword) {
  const isPasswordMatched = await bcrypt.compare(inputPassword, hashedPassword);
  return isPasswordMatched;
}

function jwtSignedToken(payload) {
  const token = jwt.sign(
    {
      // exp: Math.floor(Date.now() / 1000) + (60 * 60),
      ...payload,
    },
    "daybedcheckinnnn"
  );
  console.log(token);
  return token;
}

function sendResponse(payload, res) {
  res.status(httpStatus.StatusCodes.OK).send(payload);
}

function sendServerFailure(res) {
  res
    .json({ message: "Something Went Wrong" })
    .status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
}

async function authorizationMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization)
      return sendResponse(
        {
          hasError: true,
          status: httpStatus.StatusCodes.UNAUTHORIZED,
          message: "Invalid Token",
        },
        res
      );
    const token = authorization.split(" ")[1];
    if (!token)
      return sendResponse(
        {
          hasError: true,
          status: httpStatus.StatusCodes.UNAUTHORIZED,
          message: "Invalid Token",
        },
        res
      );
    const decodedToken = jwt.verify(token, "daybedcheckinnnn");
    const userId = decodedToken.id;
    const userInfo = await DB.users.getUser({ id: userId });
    if (!userInfo)  {
      return sendResponse(
        {
          hasError: true,
          status: httpStatus.StatusCodes.UNAUTHORIZED,
          message: "Invalid Token",
        },
        res
      );
    }
    req.userInfo = userInfo;
    next();
  } catch (e) {
    return sendResponse(
      {
        hasError: true,
        status: httpStatus.StatusCodes.UNAUTHORIZED,
        message: "Invalid Token",
      },
      res
    );
  }
}

function limitOffset(query) {
  const pageSize = query.size ? Number(query.size) : 50;
  const pageNum = query.pageNum > 0 ? Number(query.pageNum) : 1;
  const offset = pageNum === 1 ? 0 : (pageNum - 1) * pageSize;
  return { limit: pageSize, offset, pageNum };
}

function randomFixedInteger(length) {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
}

function generateOTP() { 
  var digits = '0123456789'; 
  let OTP = ''; 
  for (let i = 0; i < 6; i++ ) { 
      OTP += digits[Math.floor(Math.random() * 10)]; 
  } 
  return OTP; 
} 

module.exports = {
  encryptPassword,
  comparePassword,
  jwtSignedToken,
  sendResponse,
  sendServerFailure,
  authorizationMiddleware,
  limitOffset,
  uploadBase64toS3,
  randomFixedInteger,
  generateOTP
};

// uploadBase64toS3('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAABRklEQVR4nAA2Acn+BJ9cnuWXOex+BPsISCo2USC4RlPpVcxF11n5S0XRpwBhKz7xPO39E/pC7yRXQXswXek5nDJb2QQ7OUhh9P4E2Oz13kA4wfLyuXQMGdhaMd8I4vGB/8RPecVa3RJkANvG60ICitYX2fXIf0IIm1EVX1Q4Hk76H8THXS8HvgHw9L3IBxkkPwAaKbVxSNzYMrY57Bu8a5K0EiqwJwkDXWAkKgMlvwjNY87Cq1paWv4z8dIThFnaTujpShCPA4JO7jdC7NFCmrv3U6Xq4eTUKjklXtcR6vaXDkQi/wMFDKbtFP9MVdTGnhrvVNd0bPGrDw5y3xyYFmHOwzwD7jQF1erG/hrjn4YSo4TX6SOFCOBVIjHw4wD7dC0xA6UV7wIyxgEa8P4Ye0LZFYAIJ38JilndRbK25tcRhQEAAP//MC+UCUZy4/sAAAAASUVORK5CYII=', 'test')
