const { sign, verify, decode } = require('jsonwebtoken')

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

function paginateCtx(ctx, pagination) {
  ctx.set('Pagination-Row-Count', pagination.rowCount)
  ctx.set('Pagination-Page-Count', pagination.pageCount)
  ctx.set('Pagination-Page', pagination.page)
  ctx.set('Pagination-Page-Size', pagination.pageSize)
}

module.exports = { paginateCtx, tokenSign, tokenVerify }
