const User = require('../models/User')
const MessageCodes = require('../../shared/messageCodes')
const HttpCodes = require('../httpCodes')
const { jwtSign, jwtVerify } = require('../util/utils')

// Autenticação - Receber token
async function auth(ctx) {
  const { username, password, rememberMe } = ctx.request.body
  let user
  try {
    user = await User.where({ username }).fetch()
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbFetch, {
      error: {
        rawErrorMessage: e
      }
    })
  }

  if (user) {
    try {
      await user.authenticate(password)
      const token = jwtSign(user.toJSON(), rememberMe)
      ctx.status = HttpCodes.OK
      ctx.body = { user, token }
    } catch (e) {
      ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errPasswordMismatch)
    }
  } else {
    ctx.throw(
      HttpCodes.BAD_REQUEST,
      MessageCodes.error.errEntityDoesNotExist('users')
    )
  }
}

// Autorização - Obter acesso a recursos da API
function authz(ctx) {
  const token = ctx.headers.authorization.split(' ')[1]
  try {
    const decoded = jwtVerify(token).user
    console
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnAuthz)
  }
}

module.exports = { auth, authz }
