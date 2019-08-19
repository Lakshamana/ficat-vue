const path = require('path')
const dotenv = require('dotenv')

const env = process.env.NODE_ENV || 'development'
const tail = env === 'development' ? '' : `.${process.env.NODE_ENV}`

const envSetup = dotenv.config({
  path: path.join(__dirname, `../.env${tail}`)
})

if (envSetup.error) {
  throw envSetup.error
}

const {
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
  DATABASE_FILE = null
} = process.env

module.exports = {
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
  DATABASE_FILE
}
