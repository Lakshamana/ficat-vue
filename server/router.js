const Router = require('koa-router')
const BodyParser = require('koa-body')

const messageCodes = require('../shared/messageCodes')
const { createOrUpdateEntity } = require('./middleware/middlewares')
const frontend = require('./routes/frontend')
const HttpCodes = require('./httpCodes')

const userRoutes = require('./routes/users')
const kaRoutes = require('./routes/knowledgeAreas')

const router = new Router()
const api = new Router({ prefix: '/api' })
const bodyParser = BodyParser()

// api middlewares

/**
 * Users
 */

// create
api.post(
  '/users/',
  bodyParser,
  createOrUpdateEntity('users', 'create'),
  userRoutes.create
)

// list
api.get('/users/', userRoutes.list)

// toggle active
api.post(
  '/users/:username',
  bodyParser,
  createOrUpdateEntity('users', 'update'),
  userRoutes.update
)

/**
 * KnowledgeAreas
 */

// create
api.post(
  '/knowledgeAreas/',
  bodyParser,
  createOrUpdateEntity('knowledgeAreas', 'create'),
  kaRoutes.create
)

// list
api.get('/knowledgeAreas/', kaRoutes.list)

// update
api.post(
  '/knowledgeAreas/:id',
  bodyParser,
  createOrUpdateEntity('knowledgeAreas', 'update'),
  kaRoutes.update
)

// delete
api.del('/knowledgeAreas/:id', kaRoutes.del)

// api not found
api.use('/*', ctx => {
  ctx.status = HttpCodes.NOT_FOUND.code
  ctx.body = messageCodes.error.errNotFound
})

router.use(api.routes())

// frontend rendering
router.get('*', frontend.render)

module.exports = router
