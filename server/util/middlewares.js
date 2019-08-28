const { validatePayload } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')
const fields = require('../routeFieldsValidation')

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
      // Validação não-vazia com erros
      ctx.status = HttpCodes.BAD_REQUEST
      const errorMessages = []
      for (const i in validation) {
        if (i === 'valid') continue
        errorMessages.push({
          errCode: MessageCodes.error[i],
          fields: `${validation[i].join(', ')}`
        })
      }
      ctx.throw(
        HttpCodes.BAD_REQUEST,
        MessageCodes.error.errOnPayloadValidation,
        {
          errors: errorMessages
        }
      )
    }
  }
}

// Requer middleware bodyParser
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
      ctx.status = HttpCodes.BAD_REQUEST
      ctx.throw(
        HttpCodes.BAD_REQUEST,
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
    ctx.status = err.status || HttpCodes.INT_SRV_ERROR
    ctx.body = err
  })
}

module.exports = { errorHandler, paginatedEntity, validator }
