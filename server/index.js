const Koa = require('koa')
const consola = require('consola')

const app = new Koa()
const router = require('./router')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

app.listen(port, host)
consola.ready({
  message: `Server listening on ${host}:${port}`,
  badge: true
})
