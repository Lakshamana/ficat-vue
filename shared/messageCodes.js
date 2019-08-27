const messages = {
  info: {},
  message: {},
  error: {
    errEntityAlreadyExist(entityName) {
      return `${entityName}AlreadyExist`
    },
    errEntityDoesNotExist(entityName) {
      return `${entityName}DoesNotExist`
    },
    errOnDbSave: 'errOnDbSave',
    invalidFields: 'invalidFields',
    missingFields: 'missingFields',
    errNotFound: 'errNotFound',
    errEntityValidation: 'errEntityValidation'
  },
  layout: {}
}

module.exports = messages
