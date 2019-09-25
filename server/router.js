const Router = require('koa-router')
const BodyParser = require('koa-body')
const unless = require('koa-unless')

const { MessageCodes } = require('../shared/messageCodes')
const { paginatedEntity, query, routeValidate } = require('./util/middlewares')
const frontend = require('./routes/frontend')
const HttpCodes = require('./httpCodes')

// Route validation object
// const fields = require('./routeFieldsValidation')

// Entities routes
const userRoutes = require('./routes/users')
const kaRoutes = require('./routes/knowledgeAreas')
const courseRoutes = require('./routes/courses')
const acdUnitiesRoutes = require('./routes/academicUnities')
const catalogRoutes = require('./routes/catalogCards')

// Auth* routes
const { auth, authz } = require('./routes/auth')

const router = new Router()
const api = new Router({ prefix: '/api' })
const bodyParser = BodyParser()

/**
 * api middlewares
 */

// Authentication
api.post('/auth', bodyParser, routeValidate('auth'), auth)

/**
 * Use middleware de autorização (authz) em todas as
 * rotas, exceto autenticação (funcionários), e GET /knowledgeAreas,
 * GET /academicUnities e criação de registro
 * de ficha catalográfica (usuários finais)
 */
authz.unless = unless
api.use(
  authz.unless({
    custom: ctx => {
      return (
        ctx.path.includes('auth') ||
        (ctx.path.includes('knowledgeAreas') && ctx.method === 'GET') ||
        (ctx.path.includes('academicUnities') && ctx.method === 'GET') ||
        (ctx.path.includes('catalogCards') && ctx.method === 'POST') ||
        (ctx.path.includes('catalogCards/get') && ctx.method === 'GET') ||
        (ctx.path.includes('courses') && ctx.method === 'GET')
      )
    }
  })
)

/**
 * Catalog cards
 */

// create
api.post(
  '/catalogCards/',
  bodyParser,
  routeValidate('catalogCard'),
  catalogRoutes.create
)

// get result
api.get('/catalogCards/get/:id', catalogRoutes.getPdfResult)

api.get('/catalogCards/', catalogRoutes.list)

// get catalog queries
api.post(
  '/catalogCards/q/',
  query(['searchType']),
  catalogRoutes.catalogQueries
)

/**
 * Users
 */

// create
api.post(
  '/users/',
  bodyParser,
  routeValidate('users', 'create'),
  userRoutes.create
)

// list
api.get('/users/', userRoutes.list)

// toggle active
api.put(
  '/users/:username',
  bodyParser,
  routeValidate('users', 'update'),
  userRoutes.update
)

/**
 * KnowledgeAreas
 */

// create
api.post(
  '/knowledgeAreas/',
  bodyParser,
  routeValidate('knowledgeAreas', 'create'),
  kaRoutes.create
)

// list
api.get(
  '/knowledgeAreas/',
  query(['page', 'size', 'description']),
  paginatedEntity,
  kaRoutes.list
)

// update
api.put(
  '/knowledgeAreas/:id',
  bodyParser,
  routeValidate('knowledgeAreas', 'update'),
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
  routeValidate('courses', 'create'),
  courseRoutes.create
)

// list
api.get('/courses/', query(['acdUnityId']), courseRoutes.list)

// update
api.put(
  '/courses/:id',
  bodyParser,
  routeValidate('courses', 'update'),
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
  routeValidate('academicUnities', 'create'),
  acdUnitiesRoutes.create
)

// list
api.get('/academicUnities/', query(['name']), acdUnitiesRoutes.list)

// update
api.put(
  '/academicUnities/:id',
  bodyParser,
  routeValidate('academicUnities', 'update'),
  acdUnitiesRoutes.update
)

// delete
api.del('/academicUnities/:id', acdUnitiesRoutes.del)

// api not found
api.use('/*', ctx => {
  ctx.status = HttpCodes.NOT_FOUND
  ctx.body = MessageCodes.error.errNotFound
})

router.use(api.routes())

// frontend rendering
router.get('*', frontend.render)

module.exports = router
