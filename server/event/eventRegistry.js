const { validatePayload } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

async function createEntity(ctx, next) {
  ctx.app.on('createEntity', async (validFields, Entity) => {
    const payload = ctx.request.body
    const validation = validatePayload(payload, validFields)
    if (validation && validation.valid) {
      ctx.status = HttpCodes.OK
      const newEntity = await Entity.forge(payload).save()
      ctx.set('location', `/api/users/${newEntity.id}`)
      ctx.body = newEntity
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
  await next()
}

module.exports = { createEntity }
