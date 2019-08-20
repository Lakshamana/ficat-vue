const path = require('path')
const config = require('./server/config')

const migrations = {
  directory: './migrations'
}

const seeds = {
  directory: './seeds'
}

const genericConnection = {
  host: config.DATABASE_HOST,
  user: config.DATABASE_USER,
  password: config.DATABASE_PASS,
  database: config.DATABASE_NAME,
  charset: 'utf8'
}

const sqliteConnection = {
  filename: path.join(__dirname, config.DATABASE_FILE)
}

const useNullAsDefault = true

const envConnection =
  config.DATABASE_TYPE === 'sqlite3' ? sqliteConnection : genericConnection

const connection = {
  client: config.DATABASE_TYPE,
  connection: envConnection
}

const obj = {
  development: {
    ...connection,
    migrations,
    seeds,
    useNullAsDefault
  },

  production: {
    ...connection,
    migrations,
    seeds,
    useNullAsDefault
  }
}

module.exports = obj
