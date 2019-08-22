const User = require('../models/User')
const { validatePayload } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

async function create(ctx, next) {
  const validFields = ['username', 'active', 'password']
  const payload = ctx.request.body
  const validation = validatePayload(payload, validFields)
  if (validation && validation.valid) {
    ctx.status = HttpCodes.OK
    const newEntity = await User.forge(payload).save()
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
}

async function list(ctx) {
  ctx.body = await User.fetchAll()
}

function update(ctx) {
  const validFields = ['active']
  ctx.app.emit('incomingPayload', validFields, async payload => {
    ctx.status = HttpCodes.OK
    const id = +ctx.params.id
    const user = await User.where({ id }).fetch()
    if (user) {
      await user.save(payload)
    }
  })
}

module.exports = { create, list, update }
