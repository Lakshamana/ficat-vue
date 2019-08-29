const Router = require('koa-router')
const BodyParser = require('koa-body')
const unless = require('koa-unless')

const messageCodes = require('../shared/messageCodes')
const { validator, paginatedEntity } = require('./util/middlewares')
const frontend = require('./routes/frontend')
const HttpCodes = require('./httpCodes')

// Entities routes
const userRoutes = require('./routes/users')
const kaRoutes = require('./routes/knowledgeAreas')
const courseRoutes = require('./routes/courses')
const acdUnitiesRoutes = require('./routes/academicUnities')

// Auth* routes
const { auth, authz } = require('./routes/auth')

const router = new Router()
const api = new Router({ prefix: '/api' })
const bodyParser = BodyParser()

// api middlewares

/**
 * Authentication
 */

api.post('/auth', bodyParser, validator('auth'), auth)

/**
 * Use middleware de autorização (authz) em todas as
 * rotas, exceto autenticação e criação de registro
 * de ficha catalográfica (usuários finais)
 *
 * TODO: add catalog route
 */
authz.unless = unless
api.use(authz.unless({ path: ['/auth'] }))

/**
 * Users
 */

// create
api.post('/users/', bodyParser, validator('users', 'create'), userRoutes.create)

// list
api.get('/users/', authz, userRoutes.list)

// toggle active
api.put(
  '/users/:username',
  bodyParser,
  validator('users', 'update'),
  userRoutes.update
)

/**
 * KnowledgeAreas
 */

// create
api.post(
  '/knowledgeAreas/',
  bodyParser,
  validator('knowledgeAreas', 'create'),
  kaRoutes.create
)

// list
api.get('/knowledgeAreas/', paginatedEntity, kaRoutes.list)

// update
api.put(
  '/knowledgeAreas/:id',
  bodyParser,
  validator('knowledgeAreas', 'update'),
  kaRoutes.update
)

// delete
api.del('/knowledgeAreas/:id', kaRoutes.del)

/**
 * Courses
 */

// create
api.post(
  '/courses/',
  bodyParser,
  validator('courses', 'create'),
  courseRoutes.create
)

// list
api.get('/courses/', courseRoutes.list)

// update
api.put(
  '/courses/:id',
  bodyParser,
  validator('courses', 'update'),
  courseRoutes.update
)

// delete
api.del('/courses/:id', courseRoutes.del)

/**
 * AcademicUnities
 */

// create
api.post(
  '/academicUnities/',
  bodyParser,
  validator('academicUnities', 'create'),
  acdUnitiesRoutes.create
)

// list
api.get('/academicUnities/', acdUnitiesRoutes.list)

// update
api.put(
  '/academicUnities/:id',
  bodyParser,
  validator('academicUnities', 'update'),
  acdUnitiesRoutes.update
)

// delete
api.del('/academicUnities/:id', acdUnitiesRoutes.del)

// api not found
api.use('/*', ctx => {
  ctx.status = HttpCodes.NOT_FOUND
  ctx.body = messageCodes.error.errNotFound
})

router.use(api.routes())

// frontend rendering
router.get('*', frontend.render)

module.exports = router
