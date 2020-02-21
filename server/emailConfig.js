const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === 465,
  auth: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWD
  }
})
