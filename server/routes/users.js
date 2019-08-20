const User = require('../models/User')
const HttpCodes = require('../httpCodes')

async function create(ctx) {
  ctx.status = HttpCodes.OK
  console.log(ctx.req)
  await new Promise(10)
  // ctx.body = await User.create()
}

async function list(ctx) {
  ctx.body = await User.fetchAll()
}

module.exports = { create, list }
