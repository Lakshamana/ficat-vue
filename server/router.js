const Router = require('koa-router')
const BodyParser = require('koa-body')

const messageCodes = require('../shared/messageCodes')
const {
  createOrUpdateEntity,
  paginatedEntity
} = require('./middleware/middlewares')
const frontend = require('./routes/frontend')
const HttpCodes = require('./httpCodes')

const userRoutes = require('./routes/users')
const kaRoutes = require('./routes/knowledgeAreas')
const courseRoutes = require('./routes/courses')
const acdUnitiesRoutes = require('./routes/academicUnities')

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
api.put(
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
api.get('/knowledgeAreas/', paginatedEntity, kaRoutes.list)

// update
api.put(
  '/knowledgeAreas/:id',
  bodyParser,
  createOrUpdateEntity('knowledgeAreas', 'update'),
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
  createOrUpdateEntity('courses', 'create'),
  courseRoutes.create
)

// list
api.get('/courses/', courseRoutes.list)

// update
api.put(
  '/courses/:id',
  bodyParser,
  createOrUpdateEntity('courses', 'update'),
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
  createOrUpdateEntity('academicUnities', 'create'),
  acdUnitiesRoutes.create
)

// list
api.get('/academicUnities/', acdUnitiesRoutes.list)

// update
api.put(
  '/academicUnities/:id',
  bodyParser,
  createOrUpdateEntity('academicUnities', 'update'),
  acdUnitiesRoutes.update
)

// delete
api.del('/academicUnities/:id', acdUnitiesRoutes.del)

// api not found
api.use('/*', ctx => {
  ctx.status = HttpCodes.NOT_FOUND.code
  ctx.body = messageCodes.error.errNotFound
})

router.use(api.routes())

// frontend rendering
router.get('*', frontend.render)

module.exports = router
