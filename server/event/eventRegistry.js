const { validatePayload } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

const eventRegistry = ctx => {
  ctx.app.on('incomingPayload', (validFields, callback) => {
    const body = ctx.request.body
    const validation = validatePayload(body, validFields)
    if (validation && validation.valid) {
      callback(body)
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
  })
}

module.exports = eventRegistry
