const Router = require('koa-router')
const messageCodes = require('../shared/messageCodes')
const frontend = require('./routes/frontend')

const HttpCodes = require('./httpCodes')

const userRoutes = require('./routes/users')

const router = new Router()
const api = new Router({ prefix: '/api' })

// api middlewares

// Users
// create
api.post('/users', userRoutes.create)

// list
api.get('/users', userRoutes.list)

// api not found
api.use('/*', ctx => {
  ctx.status = HttpCodes.NOT_FOUND
  ctx.body = messageCodes.error.errNotFound
})

// frontend rendering
router.get('*', frontend.render)

router.use(api.routes())

module.exports = router
