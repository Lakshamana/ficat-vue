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

const connection =
  config.DATABASE_TYPE === 'sqlite3' ? sqliteConnection : genericConnection

const db = {
  client: config.DATABASE_TYPE,
  connection
}

const obj = {
  development: {
    ...db,
    migrations,
    seeds,
    useNullAsDefault
  },

  test: {
    ...db,
    migrations,
    seeds,
    useNullAsDefault,
    ...(db === sqliteConnection && { connection: ':memory:' })
  },

  production: {
    ...connection,
    migrations,
    seeds,
    useNullAsDefault
  }
}

module.exports = obj
