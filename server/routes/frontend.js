const { Nuxt, Builder } = require('nuxt')
const config = require('../../nuxt.config')
const HttpCodes = require('../httpCodes')

config.dev = process.env.NODE_ENV !== 'production'

// Instantiate nuxt.js
const nuxt = new Nuxt(config)

// Build in development
const build = config.dev ? new Builder(nuxt).build() : nuxt.ready()

async function render(ctx) {
  await build

  ctx.status = HttpCodes.OK
  ctx.respond = false // Bypass Koa's built-in response handling
  ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
  nuxt.render(ctx.req, ctx.res)
}

module.exports = { render }
