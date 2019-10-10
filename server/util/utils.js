const { sign, verify, decode } = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const HttpCodes = require('../httpCodes')
const { MessageCodes } = require('../../shared/messageCodes')

// Default exp = 4h
const TIMEOUT = 60 * 60 * 4

async function tokenSign(user, rememberMe, expiresIn = TIMEOUT) {
  const exp = Math.floor(Date.now() / 1000) + expiresIn
  const xsrfToken = await hash(JSON.stringify(user))
  return {
    accessToken: sign(
      { user, exp, rmb: !!rememberMe, xsrfToken },
      process.env.JWT_SECRET
    ),
    xsrfToken
  }
}

/* RememberMe prolonga a expiração para 24h (default)
 * Verificar o token recebido no header contra o xsrfToken no JWT
 */
function tokenVerify(token, xsrfToken, rememberMeFactor = 6) {
  const tokenPayload = decode(token, { json: true })
  const maxAge = tokenPayload.rmb ? TIMEOUT * rememberMeFactor : TIMEOUT
  if (!tokenPayload.xsrfToken === xsrfToken) {
    throw new Error('invalid xsrf token')
  }
  return verify(token, process.env.JWT_SECRET, { maxAge })
}

function payloadErrors(ctx, validationResult) {
  // Validação não-vazia com erros
  ctx.status = HttpCodes.BAD_REQUEST
  const errorMessages = []
  for (const i in validationResult) {
    if (i === 'valid') continue
    errorMessages.push({
      errCode: MessageCodes.error[i],
      fields: `${validationResult[i].join(', ')}`
    })
  }
  ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnPayloadValidation, {
    errors: errorMessages
  })
}

function paginateCtx(ctx, pagination) {
  ctx.set('Pagination-Row-Count', pagination.rowCount)
  ctx.set('Pagination-Page-Count', pagination.pageCount)
  ctx.set('Pagination-Page', pagination.page)
  ctx.set('Pagination-Page-Size', pagination.pageSize)
}

async function hash(data) {
  const result = await bcrypt.hash(data, 12)
  return result
}

module.exports = {
  paginateCtx,
  tokenSign,
  tokenVerify,
  payloadErrors,
  hash
}
