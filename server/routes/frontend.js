const { Nuxt, Builder } = require('nuxt')
const config = require('../../config')

config.dev = process.env.NODE_ENV !== 'production'

async function render () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  await config.dev ? new Builder(config).build() : nuxt.ready()

  ctx.status = 200
  ctx.respond = false // Bypass Koa's built-in response handling
  ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
  nuxt.render(ctx.req, ctx.res)
}

module.exports = { render }
