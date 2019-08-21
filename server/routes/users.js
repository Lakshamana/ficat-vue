const User = require('../models/User')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')
const { validatePayload } = require('../../shared/utils')

async function create(ctx) {
  const body = ctx.request.body
  const validAttrs = ['username', 'active', 'password']
  const validation = validatePayload(body, validAttrs)
  if (validation && validation.valid) {
    ctx.status = HttpCodes.OK
    const newUser = await User.forge(body).save()
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
}

async function list(ctx) {
  ctx.body = await User.fetchAll()
}

async function update(ctx) {
  const body = ctx.request.body
  const validation = validatePayload(body, ['active'])
  if (validation && validation.valid) {
    ctx.status = HttpCodes.OK
    const id = +ctx.params.id
    const user = await User.where({ id }).fetch()
    ctx.set('Location', `/users/${user.id}`)
    ctx.body = user
  } else {
    ctx.status = HttpCodes.BAD_REQUEST
    ctx.body = {
      messages: `Invalid fields: [${validation.fields.join(', ')}]`
    }
  }
}

module.exports = { create, list, update }
