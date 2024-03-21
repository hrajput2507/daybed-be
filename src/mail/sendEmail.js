const nodemailer = require("nodemailer");
const sesTransport = require("nodemailer-ses-transport");

const mailSender = {
  sendMail: function (param) {
    let result = true;

    var sesTransporter = nodemailer.createTransport(
      sesTransport({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_SES_REGION,
      })
    );
   console.log("otp",param.otp)
    var mailOptions = {
      from: process.env.FROM_EMAIL,
      to: param.toEmail,
      subject: param.subject,
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            overflow: hidden; /* Added to ensure the container wraps around the image */
          }
          .header {
            background-color: #000000;
            color: white;
            padding: 10px;
            text-align: center;
          }
          .header img {
            width: 100%;
            height: auto;
          }
          .content {
            padding: 20px;
            text-align: left;
          }
          .footer {
            background-color: #333333; /* Dark footer background */
            color: #ffffff; /* White text color */
            padding: 10px;
            text-align: center;
            font-size: 0.8em;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            
            <img src="https://daybed-backend-dev-docs.s3.amazonaws.com/94311963-49a1-4a19-bb9e-bd3b2183246e-daybed_mail_header.png" alt="DayBed Header"> <!-- Use 'cid' for embedded images in emails -->
          </div>
          <div class="content">
            <p>Welcome to DayBed!</p>
            <p>We're very excited to have you on board. Here is Your Email Otp for Email Verification :- ${param.otp}</p>
            <p>Thank you for choosing us for your unique stay experiences.</p>
          </div>
          <div class="footer">
            &copy; 2023 DayBed. All rights reserved.
          </div>
        </div>
      </body>
      </html>
      `
    };
   try{
    sesTransporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("🚀 ~ file: sendEmail.js ~ line 33 ~ error", error);
        result = false;
      }
    });

    return result;
  }
  catch{error}
  {
    throw Error;
  }
  },
};

module.exports = mailSender;
