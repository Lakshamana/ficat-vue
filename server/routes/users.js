const User = require('../models/User')
const HttpCodes = require('../httpCodes')

function create(ctx) {
  const validFields = ['username', 'active', 'password']
  ctx.app.emit(
    'incomingPayload',
    (validFields,
    async body => {
      ctx.status = HttpCodes.OK
      const newUser = await User.forge(body).save()
      ctx.set('Location', `/users/${newUser.id}`)
      ctx.body = newUser
    })
  )
}

async function list(ctx) {
  ctx.body = await User.fetchAll()
}

function update(ctx) {
  const validFields = ['active']
  ctx.app.emit(
    'incomingPayload',
    (validFields,
    async body => {
      ctx.status = HttpCodes.OK
      const id = +ctx.params.id
      const user = await User.where({ id }).fetch()
      if (user) {
        await user.save(body)
      }
    })
  )
}

module.exports = { create, list, update }
