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
    from: '"Wwwooo 👻" <weronika.contact@gmail.com>',
    to,
    subject,
    html,
  });
};

// main("ijinnj", "uuhhh", "weronika.tlusciak@gmail.com");

module.exports = { main };
