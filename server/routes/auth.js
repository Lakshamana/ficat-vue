const User = require('../models/User')
const MessageCodes = require('../../shared/messageCodes')
const HttpCodes = require('../httpCodes')
const { jwtSign } = require('../util/utils')

async function auth(ctx) {
  const { username, password } = ctx.request.body
  let user
  try {
    user = User.where({ username }).fetch()
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbFetch, {
      error: {
        rawErrorMessage: e
      }
    })
  }

  if (user) {
    try {
      user = await User.authenticate(password)
      ctx.status = HttpCodes.OK
      const token = jwtSign(user.toJSON())
      ctx.body = { user, token }
    } catch (e) {
      ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errPasswordMismatch)
    }
  } else {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errPasswordMismatch)
  }
}

module.exports = { auth }
