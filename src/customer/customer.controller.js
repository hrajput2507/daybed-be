const validator = require("./customer.validator");
const service = require("./customer.service");
const helper = require("../../util/helper");
const authService = require("./auth/auth.service");
const HttpStatus = require("http-status-codes");
const { Op } = require("sequelize");
const { USER_STATUS, ROLES } = require("../../util/constants");
const redisObj = require("../../redis");
const sendSms = require("../sms");
const commomController = require("../common/common.controller")
const models = require('../../sequelize/models/index')

async function createCustomer(req, res) {
  try {
    const joiValidator = validator.createCustomerSchema.validate(req.body);
    if (joiValidator.error) {
      return helper.sendResponse(
        {
          hasError: true,
          message: joiValidator.error.message,
          status: HttpStatus.StatusCodes.BAD_REQUEST,
        },
        res
      );
    }

    const whereClause = {
      [Op.or]: [{ email: req.body.email }, { phone: req.body.phone }],
    };
    const user = await service.getCustomerProfile(whereClause);

    if (user) {
      return helper.sendResponse(
        {
          hasError: true,
          status: HttpStatus.StatusCodes.UNAUTHORIZED,
          message: "Customer already registered",
        },
        res
      );
    }

    const encryptedPassword = await helper.encryptPassword(req.body.password);
    const result = await service.createCustomer({
      ...req.body,
      password: encryptedPassword,
      dateofBirth: new Date(req.body.dateofBirth),
      status: USER_STATUS.INACTIVE,
      role: ROLES.CUSTOMER,
    });
    const { token } = await authService.generateToken(result)
    return helper.sendResponse({ user: result, token }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function getCustomerProfile(req, res) {
  try {
    const userId = req.userInfo.id;

    const user = await service.getCustomerProfile({
      id: userId,
    });

    if (!user) {
      return helper.sendResponse(
        {
          hasError: true,
          status: HttpStatus.StatusCodes.NOT_FOUND,
          message: "Customer not found",
        },
        res
      );
    }
    return helper.sendResponse(user, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function updateCustomerProfile(req, res) {
  try {
    const joiValidator = validator.updateProfileCustomer.validate(req.body);
    if (joiValidator.error) {
      return helper.sendResponse(
        {
          hasError: true,
          message: joiValidator.error.message,
          status: HttpStatus.StatusCodes.BAD_REQUEST,
        },
        res
      );
    }
    const userId = req.userInfo.id;

    const user = await service.getCustomerProfile({
      id: userId,
    });

    if (!user) {
      return helper.sendResponse(
        {
          hasError: true,
          status: HttpStatus.StatusCodes.NOT_FOUND,
          message: "Customer not found",
        },
        res
      );
    }

    let payload = {
      ...req.body,
    };

    if (req.body.password) {
      const encryptedPassword = await helper.encryptPassword(req.body.password);
      payload = {
        ...payload,
        password: encryptedPassword,
      };
    }

    const updatedUser = await service.updateCustomerProfile(payload, {
      where: {
        id: userId,
      },
    });

    return helper.sendResponse(updatedUser, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function changePassword(req, res) {
  try {
    const joiValidator = validator.updatePassword.validate(req.body);
    if (joiValidator.error) {
      return helper.sendResponse(
        {
          hasError: true,
          message: joiValidator.error.message,
          status: HttpStatus.StatusCodes.BAD_REQUEST,
        },
        res
      );
    }
    const userId = req.userInfo.id;

    const user = await service.getCustomerProfile({
      id: userId,
    });

    if (!user) {
      return helper.sendResponse(
        {
          hasError: true,
          status: HttpStatus.StatusCodes.NOT_FOUND,
          message: "Customer not found",
        },
        res
      );
    }
    const comparePass = await helper.comparePassword(req.body.currentPassword, user.password)
    if (!comparePass) {
      return helper.sendResponse(
        {
          hasError: true,
          status: HttpStatus.StatusCodes.BAD_REQUEST,
          message: "Invalid Current Password",
        },
        res
      );
    }
    const encryptedPassword = await helper.encryptPassword(req.body.newPassword);

    const updatedUser = await service.updateCustomerProfile({
      password: encryptedPassword,
    }, {
      where: {
        id: userId,
      },
    });

    return helper.sendResponse(updatedUser, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}
async function sendMobileOtp(req, res) {
  console.log(
    "🚀 ~ file: customer.controller.js:126 ~ sendMobileOtp ~ req:",
    req.userInfo
  );
  try {
    const phone = req.body.phone;
    const joiValidator = validator.sendPhoneOtp.validate(req.body);
    if (joiValidator.error) {
      return helper.sendResponse(
        {
          hasError: true,
          message: joiValidator.error.message,
          status: HttpStatus.StatusCodes.BAD_REQUEST,
        },
        res
      );
    }

    const redisClient = await redisObj.getConnection();
    const otp = helper.generateOTP();
    console.log(
      "🚀 ~ file: customer.controller.js:147 ~ sendMobileOtp ~ otp:",
      otp
    );
    let response = await redisClient?.SETEX(phone, 60, otp);

    if (response === "OK") {
      sendSms(`+91${phone}`, `Please find your OTP: ${otp}`);
    }

    return helper.sendResponse(
      { status: HttpStatus.StatusCodes.OK, success: true },
      res
    );
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function verifyMobileOtp(req, res) {
  try {
    const userId = req.userInfo.id;
    const phone = req.body.phone;
    const otp = req.body.otp;

    const joiValidator = validator.verifyPhoneOtp.validate(req.body);
    if (joiValidator.error) {
      return helper.sendResponse(
        {
          hasError: true,
          message: joiValidator.error.message,
          status: HttpStatus.StatusCodes.BAD_REQUEST,
        },
        res
      );
    }

    //verfiyOtp
    const redisClient = await redisObj.getConnection();
    const data = await redisClient?.GET(phone);

    if (data == otp) {
      const user = await service.getCustomerByPhone(phone);
      if (user) {
        user.status = USER_STATUS.PHONE_VERIFIED;
        const result = await service.updateCustomerProfile(
          {
            application_status: USER_STATUS.PHONE_VERIFIED,
            phone_verified: true,
            phone: phone
          },
          {
            where: {
              id: userId,
            },
          }
        );
        console.log(
          "🚀 ~ file: customer.controller.js:194 ~ verifyMobileOtp ~ result:",
          result
        );
        return helper.sendResponse(
          {
            status: HttpStatus.StatusCodes.OK,
            message: "Success",
          },
          res
        );
      }
      return helper.sendResponse(
        {
          status: HttpStatus.StatusCodes.NOT_FOUND,
          message: "User not found with this number",
        },
        res
      );
    }

    return helper.sendResponse(
      { status: HttpStatus.StatusCodes.UNAUTHORIZED, message: "OTP mismatch" },
      res
    );
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
}

async function uploadDocument(req, res) {
  console.log("🚀 ~ file: customer.controller.js ~ uploadDocument ~ req:", req.body.document_type);

  try {
    const userId = req.userInfo.id;
    const result = await commomController.uploadDocument(req, res);
    console.log("🚀 ~ file: customer.controller.js ~ uploadDocument ~ result:", result);

    if (result.hasError) {
      return helper.sendResponse({
        status: result.status,
        message: result.message,
      }, res);
    }

    const document_link = result.document_link;
    if (req.body.document_type === "payslip") {
      const query = `
      UPDATE users
      SET payslip_url = :document_link
      WHERE id = :userId
    `;

      await models.sequelize.query(query, {
        replacements: { document_link, userId },
        type: models.sequelize.QueryTypes.UPDATE,
      });
    } else {
      const query = `
      UPDATE users
      SET passport_url = :document_link
      WHERE id = :userId
    `;

      await models.sequelize.query(query, {
        replacements: { document_link, userId },
        type: models.sequelize.QueryTypes.UPDATE,
      });
    }

    return helper.sendResponse({
      status: HttpStatus.StatusCodes.OK,
      message: "Success",
    }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res, e.message);
  }
}


async function updateDocumentStatus(req, res, document_link) {
  try {

    const user = await service.getCustomerProfile({ id: req.userInfo.id })

    if (req.document_type === "payslip") {
      user.passport_url = payslip_url
    } else {
      user.passport_url = document_link
    }
    await user.save(user)
    return helper.sendResponse(
      {
        status: HttpStatus.StatusCodes.OK,
        message: "Success",
      },
      res
    );

  } catch (error) {
    console.log(error);
    helper.sendServerFailure(res);

  }
}

module.exports = {
  createCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  sendMobileOtp,
  verifyMobileOtp, uploadDocument, updateDocumentStatus, changePassword
};
