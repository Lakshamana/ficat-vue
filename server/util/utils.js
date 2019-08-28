const { sign, verify, decode } = require('jsonwebtoken')

// Default exp = 4h
const TIMEOUT = 60 * 60 * 4
const NOW = Math.floor(Date.now() / 1000)
const DEFAULT_EXP = NOW + TIMEOUT

function jwtSign(user, rememberMe, expiresIn = DEFAULT_EXP) {
  return {
    access_token: sign({ user, rmb: !!rememberMe }, process.env.JWT_SECRET, {
      expiresIn
    }),
    expires_in: TIMEOUT
  }
}

// RememberMe prolonga a expiração para 24h
function jwtVerify(token, rememberMeFactor = 8) {
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

module.exports = { paginateCtx, jwtSign, jwtVerify }
