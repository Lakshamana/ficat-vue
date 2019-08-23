const User = require('../models/User')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

async function create(ctx) {
  ctx.status = HttpCodes.OK.code
  const payload = ctx.state
  const newUser = await User.forge(payload).save()
  ctx.set('location', `/api/users/${newUser.id}`)
  ctx.body = newUser
}

async function list(ctx) {
  ctx.body = await User.fetchAll()
}

async function update(ctx) {
  const id = +ctx.params.id
  const payload = ctx.state
  const user = await User.where({ id }).fetch()
  if (user) {
    try {
      const newUser = await user.save(payload)
      ctx.body = newUser
    } catch (e) {
      ctx.throw(HttpCodes.INT_SRV_ERROR.code, HttpCodes.INT_SRV_ERROR.message, {
        code: MessageCodes.error.errorOnDbSave,
        rawErrorMessage: e
      })
    }
  } else {
    ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
      code: MessageCodes.error.errorOnDbSave
    })
  }
}

module.exports = { create, list, update }
