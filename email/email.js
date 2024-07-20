const nodemailer = require("nodemailer");
require("dotenv").config();

const { M_USER, M_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: M_USER,
    pass: M_PASS,
  },
});

const main = async (email, html) => {
  const info = await transporter.sendMail({
    from: '"Verification process 👻" <verifyuser@gmail.com>',
    to: email,
    subject: "Verify your e-mail",
    html, 
  });
};

module.exports = { main };
