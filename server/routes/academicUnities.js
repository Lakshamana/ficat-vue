const AcademicUnity = require('../models/AcademicUnity')
const HttpCodes = require('../httpCodes')
const { MessageCodes } = require('../../shared/messageCodes')

async function create(ctx) {
  const payload = ctx.request.body
  ctx.status = HttpCodes.OK
  try {
    const newAcademicUnity = await AcademicUnity.forge(payload).save()
    ctx.body = newAcademicUnity
    ctx.status = HttpCodes.OK
    const id = newAcademicUnity.id
    ctx.set('Location', `/api/academicUnities/${id}`)
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbSave, {
      error: {
        rawErrorMessage: e
      }
    })
  }
}

async function list(ctx) {
  let query = AcademicUnity
  const name = ctx.query.name
  if (name) {
    query = query.where('name', 'like', `%${name}%`)
  }
  try {
    ctx.body = await query.fetchAll()
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbFetch, {
      error: {
        rawErrorMessage: e
      }
    })
  }
}

async function update(ctx) {
  const id = +ctx.params.id
  const payload = ctx.request.body
  let academicUnity = await AcademicUnity.where({ id }).fetch()
  if (academicUnity) {
    try {
      academicUnity = await AcademicUnity.where({ id }).save(payload, {
        patch: true
      })
      ctx.body = academicUnity
      ctx.status = HttpCodes.OK
    } catch (e) {
      ctx.throw(HttpCodes.INT_SRV_ERROR, MessageCodes.error.errOnDbSave, {
        error: {
          rawErrorMessage: e
        }
      })
    }
  } else {
    ctx.throw(
      HttpCodes.BAD_REQUEST,
      MessageCodes.error.errEntityDoesNotExist('AcademicUnity')
    )
  }
}

async function del(ctx) {
  const id = +ctx.params.id
  const existingAcademicUnity = await AcademicUnity.where({ id }).fetch()
  if (!existingAcademicUnity) {
    ctx.throw(
      HttpCodes.BAD_REQUEST,
      MessageCodes.error.errEntityDoesNotExist('AcademicUnity')
    )
    return
  }
  try {
    await AcademicUnity.where({ id }).destroy()
    ctx.status = HttpCodes.OK
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbSave)
  }
}

module.exports = { create, list, update, del }
