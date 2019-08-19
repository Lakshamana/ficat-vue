const Router = require('koa-router')
const messageCodes = require('../shared/messageCodes')
const frontend = require('./routes/frontend')

const httpCodes = require('./httpCodes')

const router = new Router()
const api = new Router({ prefix: '/api' })

// api middlewares
// TODO: add api routes

// api not found
api.use('/*', (ctx) => {
  ctx.status = httpCodes.NOT_FOUND
  ctx.body = messageCodes.error.errNotFound
})

// frontend rendering
router.get('*', frontend.render)

router.use(api.routes())

module.exports = router
