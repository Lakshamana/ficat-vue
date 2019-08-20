const bookshelf = require('../db')

module.exports = bookshelf.Model.extend({
  tableName: 'user',
  hasSecurePassword: true,
  hidden: 'password_digest'
})
