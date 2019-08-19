const Bookshelf = require('bookshelf')
const bookshelfSecurePasswd = require('bookshelf-secure-password')
const knex = require('../knexfile')

const bookshelf = Bookshelf(knex)
bookshelf.plugin('registry')
bookshelf.plugin('pagination')
bookshelf.plugin('visibility')
bookshelf.plugin(bookshelfSecurePasswd)

module.exports = bookshelf
