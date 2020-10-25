const { validatePayload, select } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')
const fields = require('../routeFieldsValidation')
const { payloadErrors } = require('../util/utils')

// Route validation function
function routeValidate(entityName, operationType) {
  const settings =
    (operationType && fields[entityName][operationType]) || fields[entityName]
  return validator(settings)
}

// Requer middleware bodyParser
function validator(validateObj) {
  const { mandatory, optional } = validateObj
  return (ctx, next) => {
    if (!mandatory) {
      ctx.throw(HttpCodes.INT_SRV_ERROR, 'Mandatory fields not valid!')
    }
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

function query(validFields, optionalFields) {
  return (ctx, next) => {
    const query = ctx.query
    // Se existe uma query
    if (Object.keys(query).length) {
      const validation = validatePayload(query, validFields, optionalFields)
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
function pageableEntity(ctx, next) {
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
    ctx.status = err.status || HttpCodes.INT_SRV_ERROR
    ctx.body = err
  })
}

exports.errorHandler = errorHandler
exports.query = query
exports.validator = validator
exports.pageableEntity = pageableEntity
exports.routeValidate = routeValidate
