const User = require('../models/User')
const HttpCodes = require('../httpCodes')

function create(ctx) {
  ctx.status = HttpCodes.OK
  console.log(ctx.req)
  // ctx.body = await User.create()
}

async function list(ctx) {
  console.log('passei')
  ctx.body = await User.fetchAll()
}

module.exports = { create, list }
