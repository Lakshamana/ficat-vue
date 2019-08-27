const Koa = require('koa')

const consola = require('consola')

const config = require('./config')
const { errorHandler } = require('./util/middlewares')

const app = new Koa()
const router = require('./router')

// Import and Set Nuxt.js options
config.dev = app.env !== 'production'

const host = config.HOST
const port = config.PORT

app.use(errorHandler)
app.use(router.routes())

app.listen(port, host)
consola.ready({
  message: `Server listening on http://${host}:${port}`,
  badge: true
})

module.exports = app
