const path = require('path')
const dotenv = require('dotenv')

const env = process.env.NODE_ENV || 'development'
const tail = env === 'development' ? '' : `.${process.env.NODE_ENV}`

const envSetup = dotenv.config({
  path: path.join(__dirname, `../env/.env${tail}`)
})

if (envSetup.error) {
  throw envSetup.error
}

const {
  PROTOCOL,
  HOST,
  PORT,
  API_PAGE_SIZE,
  JWT_SECRET,
  DATABASE_TYPE,
  DATABASE_HOST = null,
  DATABASE_PORT = null,
  DATABASE_USER = null,
  DATABASE_PASS = null,
  DATABASE_NAME = null,
  DATABASE_FILE = null,
  EMAIL_HOST = null,
  EMAIL_PORT = null,
  EMAIL_USER = null,
  EMAIL_PASSWD = null,
  EMAIL_RCV_ADDRESS = null,
  RECAPTCHA_SITE_KEY = null
} = process.env

module.exports = {
  PROTOCOL,
  HOST,
  PORT,
  API_PAGE_SIZE,
  JWT_SECRET,
  DATABASE_TYPE,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_NAME,
  DATABASE_FILE,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASSWD,
  EMAIL_RCV_ADDRESS,
  RECAPTCHA_SITE_KEY
}
