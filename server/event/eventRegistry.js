const { validatePayload } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

function eventRegistry(ctx, next) {
  ctx.app.on('incomingPayload', async (validFields, callback) => {
    const payload = ctx.request.body
    const validation = validatePayload(payload, validFields)
    if (validation && validation.valid) {
      ctx.status = HttpCodes.OK
      const newUser = await callback(payload)
      ctx.set('Location', `/users/${newUser.id}`)
      ctx.body = newUser
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
  return next()
}

module.exports = eventRegistry
