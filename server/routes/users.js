const User = require('../models/User')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

async function create(ctx) {
  const payload = ctx.request.body
  const username = payload.username
  const existingUser = await User.where({ username }).fetch()
  if (existingUser) {
    ctx.throw(
      HttpCodes.BAD_REQUEST.code,
      MessageCodes.error.errEntityAlreadyExist('user')
    )
    return
  }
  ctx.status = HttpCodes.OK.code
  const newUser = await User.forge(payload).save()
  ctx.set('Location', `/api/users/${username}`)
  ctx.body = newUser
}

async function list(ctx) {
  try {
    ctx.body = await User.fetchAll()
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST.code, 'DbError', {
      error: {
        rawErrorMessage: e
      }
    })
  }
}

async function update(ctx) {
  const username = ctx.params.username
  const payload = ctx.request.body
  let user = await User.where({ username }).fetch()
  if (user) {
    try {
      user = await User.where({ username }).save(payload, {
        patch: true
      })
      ctx.status = HttpCodes.OK.code
      ctx.body = user
    } catch (e) {
      ctx.throw(HttpCodes.INT_SRV_ERROR.code, MessageCodes.error.errOnDbSave, {
        error: {
          rawErrorMessage: e
        }
      })
    }
  } else {
    ctx.throw(
      HttpCodes.BAD_REQUEST.code,
      MessageCodes.error.errEntityDoesNotExist('user')
    )
  }
}

module.exports = { create, list, update }
