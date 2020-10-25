const path = require('path')
const config = require('./server/config')

const migrations = {
  directory: './migrations'
}

const seeds = {
  directory: './seeds'
}

const connection = {
  host: config.DATABASE_HOST,
  user: config.DATABASE_USER,
  password: config.DATABASE_PASS,
  database: config.DATABASE_NAME,
  charset: 'utf8'
}

const useNullAsDefault = true

const db = {
  client: config.DATABASE_TYPE,
  connection
}

const dbConfig = {
  ...db,
  migrations,
  seeds,
  useNullAsDefault
}

const obj = {
  development: dbConfig,
  test: dbConfig,
  travis: dbConfig,
  production: dbConfig
}

module.exports = obj
