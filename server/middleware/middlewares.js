const { validatePayload } = require('../../shared/utils')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

const createEntityValidFields = {
  users: {
    mandatory: ['username', 'password', 'active']
  },
  knowledgeAreas: {
    mandatory: ['code', 'description']
  },
  courses: {
    mandatory: ['name', 'program', 'type', 'unity_id'],
    optional: ['program']
  },
  academicUnities: {
    mandatory: ['name', 'acronym']
  }
}

const updateEntityValidFields = {
  users: {
    mandatory: ['active']
  },
  knowledgeAreas: {
    mandatory: ['description']
  },
  courses: {
    mandatory: ['name', 'program', 'type', 'unity_id'],
    optional: ['name', 'program', 'type', 'unity_id']
  },
  academicUnities: {
    mandatory: ['name', 'acronym'],
    optional: ['name', 'acronym']
  }
}

function createOrUpdateEntity(entityName, operation) {
  const useOperation =
    operation === 'create' ? createEntityValidFields : updateEntityValidFields
  return (ctx, next) => {
    const payload = ctx.request.body
    const validation = validatePayload(
      payload,
      useOperation[entityName].mandatory,
      useOperation[entityName].optional
    )
    if (validation && validation.valid) {
      return next()
    } else {
      // Validação vazia (undefined)
      if (!validation) {
        ctx.throw(
          HttpCodes.BAD_REQUEST.code,
          MessageCodes.error.errEmptyPayload
        )
      }
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
        MessageCodes.error.errOnEntityValidation,
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

module.exports = { createOrUpdateEntity, errorHandler, paginatedEntity }
