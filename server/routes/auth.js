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
      const accessToken = tokenSign(user, rememberMe)
      const xsrfToken = await hash(accessToken)
      ctx.status = HttpCodes.OK
      ctx.cookies.set('accessToken', accessToken, {
        domain: process.env.HOST,
        secure: false,
        httpOnly: true
      })
      ctx.cookies.set('xsrfToken', xsrfToken, {
        domain: process.env.HOST,
        secure: false
      })
    } catch (e) {
      console.log(e)
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
