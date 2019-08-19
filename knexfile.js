const path = require('path')
const Knex = require('knex')
const config = require('./server/config')

const migrations = {
  directory: path.join(__dirname, 'server/migrations')
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

const connectionSetup =
  process.env.NODE_ENV === 'development' ? sqliteConnection : genericConnection
const useNullAsDefault = true

const envs = {
  development: {
    ...connectionSetup,
    migrations,
    useNullAsDefault
  },

  production: {
    ...connectionSetup,
    migrations,
    useNullAsDefault
  }
}

const knex = Knex({
  client: config.DATABASE_NAME,
  ...envs[process.env.NODE_ENV]
})

module.exports = knex
