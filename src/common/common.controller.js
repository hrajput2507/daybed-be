const AWS = require("aws-sdk");
const busboy = require("busboy");
const { v4: uuidV4 } = require("uuid");
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
const S3 = new AWS.S3();
const HttpStatus = require("http-status-codes");
const helper = require("../../util/helper");
const DB = require("../../sequelize/db-wrappers");
const _ = require("lodash");
const { Op } = require('sequelize'); // Import the Op operator from Sequelize
const customerController = require("../customer/customer.controller")
const fileUpload = (req, res) => {
  let chunks = [],
    fName,
    fType;
  const bb = busboy({ headers: req.headers });
  bb.on("file", (name, file, info) => {
    const { filename, mimeType } = info;
  console.log("🚀 ~ process.env.ACCESS_KEY_ID:", process.env.ACCESS_KEY_ID)

    if (
      mimeType != "image/png" &&
      mimeType != "image/jpg" &&
      mimeType != "image/jpeg" &&
      mimeType != "application/zip" &&
      mimeType != "application/x-zip-compressed" &&
      mimeType != "application/pdf"
    ) {
      return helper.sendResponse(
        {
          hasError: true,
          status: HttpStatus.StatusCodes.BAD_REQUEST,
          message: "File type not supported",
        },
        res
      );
    }
    fName = filename.replace(/ /g, "_");
    fType = mimeType;
    file.on("data", function (data) {
      chunks.push(data);
    });
    file.on("end", function () {
      console.log("File [" + filename + "] Finished");
    });
  });
  bb.on("finish", function () {
    const userId = uuidV4();
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${userId}-${fName}`,
      Body: Buffer.concat(chunks),
      ContentType: fType,
    };

    S3.upload(params, (err, s3res) => {
      if (err) {
        console.log(
          "🚀 ~ file: common.controller.js:57 ~ S3.upload ~ err:",
          err
        );
        return helper.sendResponse(
          {
            hasError: true,
            status: HttpStatus.StatusCodes.BAD_REQUEST,
            message: err.message,
          },
          res
        );
      } else {
        return helper.sendResponse(
          {
            fileName: fName,
            url: s3res.Location,
            hasError: false,
            message: "",
          },
          res
        );
      }
    });
  });
  req.pipe(bb);
};

const getListingFilters = async (req, res) => {
  try {
    const type = ["shared", "entire"];

    let data = {
      type,
    };

    let where = {
      unit_status: 'vacant'
    };
    if (req.query.city) {
      where = {
        ...where,
        city: {
          [Op.iLike]: req.query.city
        }
      }
    }

    let units = await DB.units.getAllWithoutClause(where);

    let suburbs = units.map((unit) => unit.suburb.toLowerCase());
    let city = units.map((unit) => unit.city.toLowerCase());
    let state = units.map((unit) => unit.state.toLowerCase());
    data["suburbs"] = _.uniq(suburbs);
    data["city"] = _.uniq(city);
    data["state"] = _.uniq(state);
    return helper.sendResponse({ data: data }, res);
  } catch (e) {
    console.log(e);
    helper.sendServerFailure(res);
  }
};


const uploadDocument = (req, res) => {
  return new Promise((resolve, reject) => {
    let chunks = [];
    let fName;
    let fType;
    const bb = busboy({ headers: req.headers });

    bb.on("file", (name, file, info) => {
      const { filename, mimeType } = info;
      if (
        mimeType !== "image/png" &&
        mimeType !== "image/jpg" &&
        mimeType !== "image/jpeg" &&
        mimeType !== "application/zip" &&
        mimeType !== "application/x-zip-compressed" &&
        mimeType !== "application/pdf"
      ) {
        reject({
          hasError: true,
          status: HttpStatus.BAD_REQUEST,
          message: "File type not supported",
        });
        return;
      }
      fName = filename.replace(/ /g, "_");
      fType = mimeType;
      file.on("data", (data) => {
        chunks.push(data);
      });
      file.on("end", () => {
        console.log(`File [${filename}] Finished`);
      });
    });

    bb.on("finish", () => {
      const userId = uuidV4();
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${userId}-${fName}`,
        Body: Buffer.concat(chunks),
        ContentType: fType,
      };

      S3.upload(params, (err, s3res) => {
        if (err) {
          console.log("Error uploading to S3:", err);
          reject({
            hasError: true,
            status: HttpStatus.BAD_REQUEST,
            message: err.message,
          });
        } else {
          console.log("Upload to S3 successful:", s3res);
          resolve({
            fileName: fName,
            document_link: s3res.Location, // Ensure this matches the property expected in the main function
            hasError: false,
            message: "File uploaded successfully",
          });
        }
      });
    });

    req.pipe(bb);
  });
};

module.exports = {
  fileUpload,
  getListingFilters,
  uploadDocument
};
