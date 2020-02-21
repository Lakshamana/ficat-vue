const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: process.env.HOST,
  port: 587,
  secure: false,
  auth: {}
})
