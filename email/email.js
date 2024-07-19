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

const main = async (html, subject, to) => {
  const info = await transporter.sendMail({
    from: '"Verification process 👻" <verify.user@user.com>',
    to: "weronika.tlusciak@gmail.com",
    subject: "Verify your e-mail",
    html: '`<h2>E-mail verification</h2><p>Please confirm your email address by clicking the link: <a href="http://localhost:3000/api/users/verify/${verificationToken}">Click!</a>. If you did not sign up, you can simply disregard this email.</p>`',
  });
  console.log("Message sent: %s", info);
};

module.exports = { main };
