const Bookshelf = require('bookshelf')
const bookshelfSecurePasswd = require('bookshelf-secure-password')
const knexConfig = require('../knexfile')

const bookshelf = Bookshelf(knexConfig)
bookshelf.plugin('registry')
bookshelf.plugin('pagination')
bookshelf.plugin('visibility')
bookshelf.plugin(bookshelfSecurePasswd)

module.exports = bookshelf
