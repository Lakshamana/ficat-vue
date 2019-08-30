const { sign, verify, decode } = require('jsonwebtoken')

const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

// Default exp = 4h
const TIMEOUT = 60 * 60 * 4

function tokenSign(user, rememberMe, expiresIn = TIMEOUT) {
  const exp = Math.floor(Date.now() / 1000) + expiresIn
  const s = sign({ user, exp, rmb: !!rememberMe }, process.env.JWT_SECRET)
  return s
}

// RememberMe prolonga a expiração para 24h (default)
function tokenVerify(token, rememberMeFactor = 8) {
  const tokenPayload = decode(token, { json: true })
  const maxAge = tokenPayload.rmb ? TIMEOUT * rememberMeFactor : TIMEOUT
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

module.exports = { paginateCtx, tokenSign, tokenVerify, payloadErrors }
