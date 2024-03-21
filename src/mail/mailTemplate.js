const Mailgen = require("mailgen");

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "DayBed",
    link: "https://daybed.io/",
    // Optional product logo
    logo: "",
  },
});

// Generate an HTML email with the provided contents

const passwordResetEmail = (params) => {
  var email = {
    body: {
      name: params.name,
      intro:
        "You have received this email because a password reset request for your account was received.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#319ECD",
          text: "Reset your password",
          link: params.link,
        },
      },
      outro:
        "If you did not request a password reset, no further action is required on your part.",
    },
  };

  var emailBody = mailGenerator.generate(email);

  return emailBody;
};

const verifyEmail = (params) => {
  var email = {
    body: {
      name: "Hello",
      intro: "Welcome to DayBed! We're very excited to have you on board.",
      table: {
        data: [
          {
            code: params.code,
          },
        ],
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = mailGenerator.generate(email);

  return emailBody;
};

module.exports = {
  passwordResetEmail,
  verifyEmail,
};
