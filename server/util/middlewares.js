const { validatePayload, select } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')
const fields = require('../routeFieldsValidation')
const { payloadErrors } = require('../util/utils')

// Requer middleware bodyParser
function validator(entityName, operationType) {
  const setting =
    (operationType && fields[entityName][operationType]) || fields[entityName]
  return (ctx, next) => {
    const mandatory = setting.mandatory
    const optional = setting.optional
    const validation = validatePayload(ctx.request.body, mandatory, optional)
    if (!validation) {
      // Validação vazia (undefined)
      ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errEmptyPayload)
    } else if (validation.valid) {
      return next()
    } else {
      payloadErrors(ctx, validation)
    }
  }
}

function query(fields) {
  return (ctx, next) => {
    const query = ctx.query
    // Se existe uma query
    if (Object.keys(query).length) {
      // Validar o objeto da query - todos os parâmetros são opcionais
      const validation = validatePayload(query, fields, fields)
      if (validation.valid) {
        return next()
      } else {
        payloadErrors(ctx, validation)
      }
    }
    return next()
  }
}

// Requer middleware query
function paginatedEntity(ctx, next) {
  const query = ctx.query
  const params = Object.keys(query)
  // Se existe uma query
  if (params.includes('page') || params.includes('size')) {
    const fields = ['page', 'size'] // atributos opcionais
    const pagination = select(query, fields, {
      page: 1,
      size: process.env.API_PAGE_SIZE
    })
    ctx.state.pagination = pagination
  } else ctx.state.pagination = false
  return next()
}

function errorHandler(ctx, next) {
  return next().catch(err => {
    console.error(err) // eslint-disable-line no-console
    ctx.status = err.status || HttpCodes.INT_SRV_ERROR
    ctx.body = err
  })
}

module.exports = { errorHandler, query, validator, paginatedEntity }
