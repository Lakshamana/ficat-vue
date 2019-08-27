const { validatePayload } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')
const fields = require('../routeFieldsValidation')

function validator(ctx, next) {
  const entityName = ctx.path.split('/')[2]
  const method = ctx.method.toLowerCase()
  const mandatory = fields[entityName][method].mandatory
  const optional = fields[entityName][method].optional
  const validation = validatePayload(ctx.request.body, mandatory, optional)
  if (!validation && validation.valid) {
    // Validação vazia (undefined)
    if (!validation) {
      ctx.throw(HttpCodes.BAD_REQUEST.code, MessageCodes.error.errEmptyPayload)
    }
  } else if (validation.valid) {
    return next()
  } else {
    // Validação não-vazia com erros
    ctx.status = HttpCodes.BAD_REQUEST.code
    const errorMessages = []
    for (const i in validation) {
      if (i === 'valid') continue
      errorMessages.push({
        errCode: MessageCodes.error[i],
        fields: `${validation[i].join(', ')}`
      })
    }
    ctx.throw(
      HttpCodes.BAD_REQUEST.code,
      MessageCodes.error.errOnEntityValidation,
      {
        errors: errorMessages
      }
    )
  }
}

function paginatedEntity(ctx, next) {
  const query = ctx.query
  // Se existe uma query
  if (Object.keys(query).length) {
    const fields = ['page', 'size'] // atributos opcionais
    const validation = validatePayload(query, fields, fields)
    const { page = 1, size = process.env.API_PAGE_SIZE } = query
    if (validation.valid) {
      ctx.state.pagination = { size, page }
    } else {
      ctx.status = HttpCodes.BAD_REQUEST.code
      ctx.throw(
        HttpCodes.BAD_REQUEST.code,
        MessageCodes.error.errOnPayloadValidation,
        {
          errors: validation.invalidFields
        }
      )
    }
  } else ctx.state.pagination = false
  return next()
}

function errorHandler(ctx, next) {
  return next().catch(err => {
    console.error(err) // eslint-disable-line no-console
    ctx.status = err.status || HttpCodes.INT_SRV_ERROR.code
    ctx.body = err
  })
}

function auth(ctx, next) {
  // const { username, payload } = ctx.request.body
}

module.exports = { errorHandler, paginatedEntity, auth, validator }
