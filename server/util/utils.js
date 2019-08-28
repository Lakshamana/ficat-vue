const { sign } = require('jsonwebtoken')

const DEFAULT_EXP = Math.floor(Date.now() / 1000) + 60 * 60 * 24

function jwtSign(user, exp = DEFAULT_EXP) {
  return sign({ user, exp }, process.env.JWT_SECRET)
}

function paginateCtx(ctx, pagination) {
  ctx.set('Pagination-Row-Count', pagination.rowCount)
  ctx.set('Pagination-Page-Count', pagination.pageCount)
  ctx.set('Pagination-Page', pagination.page)
  ctx.set('Pagination-Page-Size', pagination.pageSize)
}

module.exports = { jwtSign, paginateCtx }
