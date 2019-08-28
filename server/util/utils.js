const { sign, verify, decode } = require('jsonwebtoken')

// Default exp = 1h
const TIMEOUT = 60 * 60
const NOW = Math.floor(Date.now() / 1000)

function jwtSign(user, rememberMe, expiresIn = NOW + TIMEOUT) {
  return sign({ user, rmb: rememberMe }, process.env.JWT_SECRET, { expiresIn })
}

function jwtVerify(token) {
  const tokenPayload = decode(token, { json: true })
  const maxAge = tokenPayload.rmb ? NOW + TIMEOUT * 24 : NOW + TIMEOUT
  return verify(token, process.env.JWT_SECRET, { maxAge })
}

function paginateCtx(ctx, pagination) {
  ctx.set('Pagination-Row-Count', pagination.rowCount)
  ctx.set('Pagination-Page-Count', pagination.pageCount)
  ctx.set('Pagination-Page', pagination.page)
  ctx.set('Pagination-Page-Size', pagination.pageSize)
}

module.exports = { paginateCtx, jwtSign, jwtVerify }
