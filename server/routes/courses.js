const Course = require('../models/Course')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

async function create(ctx) {
  const payload = ctx.request.body
  ctx.status = HttpCodes.OK.code
  try {
    const newCourse = await Course.forge(payload).save()
    ctx.body = newCourse
    ctx.status = HttpCodes.OK.code
    const id = newCourse.id
    ctx.set('Location', `/api/courses/${id}`)
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
      error: {
        errCode: MessageCodes.error.errOnDbSave,
        rawErrorMessage: e
      }
    })
  }
}

async function list(ctx) {
  ctx.body = await Course.fetchAll()
}

async function update(ctx) {
  const id = +ctx.params.id
  const payload = ctx.request.body
  let course = await Course.where({ id }).fetch()
  if (course) {
    try {
      course = await Course.where({ id }).save(payload, {
        patch: true
      })
      ctx.body = course
      ctx.status = HttpCodes.OK.code
    } catch (e) {
      ctx.throw(HttpCodes.INT_SRV_ERROR.code, HttpCodes.INT_SRV_ERROR.message, {
        error: {
          errCode: MessageCodes.error.errOnDbSave,
          rawErrorMessage: e
        }
      })
    }
  } else {
    ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
      error: {
        errCode: MessageCodes.error.errEntityDoesNotExist('Course')
      }
    })
  }
}

async function del(ctx) {
  const id = +ctx.params.id
  const existingCourse = await Course.where({ id }).fetch()
  if (!existingCourse) {
    ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
      errCode: MessageCodes.error.errEntityDoesNotExist('Course')
    })
    return
  }
  try {
    await Course.where({ id }).destroy()
    ctx.status = HttpCodes.OK.code
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
      errCode: MessageCodes.error.errOnDbSave
    })
  }
}

module.exports = { create, list, update, del }
