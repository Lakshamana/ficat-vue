const User = require('../models/User')
const { MessageCodes } = require('../../shared/messageCodes')
const HttpCodes = require('../httpCodes')
const { tokenSign, tokenVerify, hash } = require('../util/utils')

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
      const signature = tokenSign(user, rememberMe)
      const xsrf = await hash(signature)
      const token = {
        accessToken: signature,
        xsrfToken: xsrf
      }
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
function authz(ctx, next) {
  const authorization = ctx.headers.authorization
  if (!authorization) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errNotAuthorized)
  }
  const token = authorization.split(' ')[1]
  try {
    tokenVerify(token)
    return next()
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnAuthz)
  }
}

module.exports = { auth, authz }
