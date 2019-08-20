const Bookshelf = require('bookshelf')
const Knex = require('knex')
const bookshelfSecurePasswd = require('bookshelf-secure-password')
const knexConfig = require('../knexfile')

const knex = Knex(knexConfig)
const bookshelf = Bookshelf(knex)

bookshelf.plugin('registry')
bookshelf.plugin('pagination')
bookshelf.plugin('visibility')
bookshelf.plugin(bookshelfSecurePasswd)

module.exports = bookshelf
