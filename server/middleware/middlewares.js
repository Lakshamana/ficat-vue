const { validatePayload } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

const createEntityValidFields = {
  users: ['username', 'password', 'active']
}

const updateEntityValidFields = {
  users: ['active']
}

function createEntity(entityName, operation) {
  const useOperation =
    operation === 'create' ? createEntityValidFields : updateEntityValidFields
  return (ctx, next) => {
    const payload = ctx.request.body
    const validation = validatePayload(payload, useOperation[entityName])
    if (validation && validation.valid) {
      ctx.state = payload
      return next()
    } else {
      ctx.status = HttpCodes.BAD_REQUEST.code
      const errorMessages = []
      for (const i in validation) {
        if (i === 'valid') continue
        errorMessages.push({
          code: MessageCodes.error[i],
          fields: `${validation[i].join(', ')}`
        })
      }
      ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
        errors: errorMessages
      })
    }
  }
}

function errorHandler(ctx, next) {
  return next().catch(err => {
    ctx.status = err.status
    ctx.body = err
  })
}

module.exports = { createEntity, errorHandler }
