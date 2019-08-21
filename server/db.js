const Bookshelf = require('bookshelf')
const Knex = require('knex')
const bookshelfSecurePasswd = require('bookshelf-secure-password')

const env = process.env.NODE_ENV || 'development'
const knexConfig = require('../knexfile')[env]

const knex = Knex(knexConfig)
const bookshelf = Bookshelf(knex)

bookshelf.plugin('registry')
bookshelf.plugin('pagination')
bookshelf.plugin('visibility')
bookshelf.plugin(bookshelfSecurePasswd)

module.exports = { bookshelf, knex }
