const { bookshelf } = require('../db')

module.exports = bookshelf.Model.extend({
  tableName: 'users',
  hasSecurePassword: true,
  hidden: 'password_digest'
})
