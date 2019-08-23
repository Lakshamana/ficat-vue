const User = require('../models/User')
const HttpCodes = require('../httpCodes')

async function create(ctx) {
  ctx.status = HttpCodes.OK
  const payload = ctx.state
  const newUser = await User.forge(payload).save()
  ctx.set('location', `/api/users/${newUser.id}`)
  ctx.body = newUser
}

async function list(ctx) {
  ctx.body = await User.fetchAll()
}

function update(ctx) {
  const validFields = ['active']
  ctx.app.emit('incomingPayload', validFields, async payload => {
    ctx.status = HttpCodes.OK
    const id = +ctx.params.id
    const user = await User.where({ id }).fetch()
    if (user) {
      await user.save(payload)
    }
  })
}

module.exports = { create, list, update }
