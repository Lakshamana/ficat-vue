const { validatePayload } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

async function payloadValidator(ctx, validFields, callback) {
  const payload = ctx.request.body
  const validation = validatePayload(payload, validFields)
  if (validation && validation.valid) {
    ctx.status = HttpCodes.OK
    try {
      const newUser = await callback(payload, ctx)
      ctx.set('Location', `/users/${newUser.id}`)
      ctx.body = newUser
    } catch (e) {
      console.log(e)
    }
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

module.exports = payloadValidator
