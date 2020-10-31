const Router = require('koa-router')
const BodyParser = require('koa-body')
const unless = require('koa-unless')

const MessageCodes = require('../shared/messageCodes')
const { pageableEntity, query, routeValidate } = require('./util/middlewares')
const frontend = require('./routes/frontend')
const HttpCodes = require('./httpCodes')

// Entities routes
const userRoutes = require('./routes/users')
const kaRoutes = require('./routes/knowledgeAreas')
const courseRoutes = require('./routes/courses')
const acdUnitiesRoutes = require('./routes/academicUnities')
const catalogRoutes = require('./routes/catalogCards')
const miscRoutes = require('./routes/miscellaneous')

// Auth* routes
const { auth, authz } = require('./routes/auth')

const { queryFields } = require('./routeFieldsValidation')

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
 * rotas, exceto autenticação (funcionários), e GET /knowledge-areas,
 * GET /academicUnities e criação de registro
 * de ficha catalográfica (usuários finais)
 */
authz.unless = unless
api.use(
  authz.unless({
    custom: ctx =>
      ctx.path === '/api/auth' ||
      (ctx.path.includes('knowledge-areas') && ctx.method === 'GET') ||
      (ctx.path.includes('academic-unities') && ctx.method === 'GET') ||
      (ctx.path === '/api/catalog-cards' && ctx.method === 'POST') ||
      (ctx.path === '/api/courses' && ctx.method === 'GET') ||
      (ctx.path === '/api/send' && ctx.method === 'POST') ||
      (ctx.path === '/api/captcha' && ctx.method === 'GET')
  })
)

/**
 * - Catalog cards -
 */

// create
api.post(
  'catalog-cards',
  bodyParser,
  routeValidate('catalogCard'),
  catalogRoutes.create
)

api.get('/catalog-cards/', catalogRoutes.list)

// get oldest card year
api.get('/catalog-cards/oldest', catalogRoutes.getFirstCatalogCardYear)

// get catalog queries
api.get(
  '/catalog-cards/q/',
  bodyParser,
  query(queryFields.mandatory, queryFields.optional),
  catalogRoutes.catalogQueries
)

/**
 * - Users -
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
 * - KnowledgeAreas -
 */

// create
api.post(
  '/knowledge-areas/',
  bodyParser,
  routeValidate('knowledgeAreas', 'create'),
  kaRoutes.create
)

// list
api.get(
  '/knowledge-areas/',
  query(undefined, ['page', 'size', 'description']),
  pageableEntity,
  kaRoutes.list
)

// update
api.put(
  '/knowledge-areas/:id',
  bodyParser,
  routeValidate('knowledgeAreas', 'update'),
  kaRoutes.update
)

// delete
api.del('/knowledge-areas/:id', kaRoutes.del)

/**
 * - Courses -
 */

// create
api.post(
  '/courses/',
  bodyParser,
  routeValidate('courses', 'create'),
  courseRoutes.create
)

// list
api.get('/courses/', query(undefined, ['acdUnityId']), courseRoutes.list)

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
 * - AcademicUnities -
 */

// create
api.post(
  '/academic-unities/',
  bodyParser,
  routeValidate('academicUnities', 'create'),
  acdUnitiesRoutes.create
)

// list
api.get('/academic-unities/', query(undefined, ['term']), acdUnitiesRoutes.list)

// update
api.put(
  '/academic-unities/:id',
  bodyParser,
  routeValidate('academicUnities', 'update'),
  acdUnitiesRoutes.update
)

// delete
api.del('/academic-unities/:id', acdUnitiesRoutes.del)

api.post(
  '/send',
  BodyParser({ multipart: true }),
  routeValidate('email'),
  miscRoutes.send
)

api.get('/captcha', miscRoutes.captchaValidate)

// api not found
api.use('/*', ctx => {
  ctx.status = HttpCodes.NOT_FOUND
  ctx.body = MessageCodes.error.errNotFound
})

router.use(api.routes())

// frontend rendering
router.get('*', frontend.render)

module.exports = router
