const { validatePayload } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

const entityValidFields = {
  users: ['username', 'password', 'active']
}

function createEntity(entityName) {
  return (ctx, next) => {
    const payload = ctx.request.body
    const validation = validatePayload(payload, entityValidFields[entityName])
    if (validation && validation.valid) {
      ctx.state = payload
      return next()
    } else {
      ctx.status = HttpCodes.BAD_REQUEST
      const errorMessages = []
      for (const i in validation) {
        if (i === 'valid') continue
        errorMessages.push({
          message: MessageCodes.error[i],
          fields: `${validation[i].join(', ')}`
        })
      }
      ctx.body = errorMessages
    }
  }
}

module.exports = { createEntity }
