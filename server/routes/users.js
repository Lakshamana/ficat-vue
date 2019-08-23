const User = require('../models/User')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

async function create(ctx) {
  ctx.status = HttpCodes.OK.code
  const payload = ctx.state
  const username = payload.username
  const existingUser = await User.where({ username }).fetch()
  if (existingUser) {
    ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
      code: MessageCodes.error.userAlreadyExists
    })
    return
  }
  const newUser = await User.forge(payload).save()
  ctx.set('location', `/api/users/${newUser.username}`)
  ctx.body = newUser
}

async function list(ctx) {
  ctx.body = await User.fetchAll()
}

async function update(ctx) {
  const username = +ctx.params.username
  const payload = ctx.state
  const user = await User.where({ username }).fetch()
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
