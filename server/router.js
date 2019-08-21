const Router = require('koa-router')
const bodyParser = require('koa-body')

const messageCodes = require('../shared/messageCodes')
const frontend = require('./routes/frontend')
const HttpCodes = require('./httpCodes')
const userRoutes = require('./routes/users')

const router = new Router()
const api = new Router({ prefix: '/api' })

router.use(bodyParser())

// api middlewares

// Users
// create
api.post('/users', userRoutes.create)

// list
api.get('/users', userRoutes.list)

// toggle active
api.get('/users/:id', userRoutes.update)

// api not found
api.use('/*', ctx => {
  ctx.status = HttpCodes.NOT_FOUND
  ctx.body = messageCodes.error.errNotFound
})

router.use(api.routes())

// frontend rendering
router.get('*', frontend.render)

module.exports = router
