const Koa = require('koa')
const consola = require('consola')
const cors = require('@koa/cors')
// const { resolve } = require('path')
// const serve = require('koa-static')

const config = require('./config')
const { errorHandler } = require('./util/middlewares')

const app = new Koa()
const router = require('./router')

// Import and Set Nuxt.js options
config.dev = app.env !== 'production'

const host = config.HOST
const port = config.PORT
const protocol = config.PROTOCOL

app.use(cors({ origin: host }))
app.use(errorHandler)
// app.use(serve(resolve(__dirname, '../assets')))
app.use(router.routes())

app.listen(port, host)
consola.ready({
  message: `Server listening on ${protocol}://${host}:${port}`,
  badge: true
})

module.exports = app
