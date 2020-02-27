const KnowledgeArea = require('../models/KnowledgeArea')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')
const { paginateCtx } = require('../util/utils')

async function create(ctx) {
  const payload = ctx.request.body
  const code = payload.code
  const existingKa = await KnowledgeArea.where({ code }).fetch()
  if (existingKa) {
    ctx.throw(
      HttpCodes.BAD_REQUEST,
      MessageCodes.error.errEntityAlreadyExist('knowledgeArea')
    )
    return
  }
  ctx.status = HttpCodes.OK
  const newKnowledgeArea = await KnowledgeArea.forge(payload).save()
  const id = newKnowledgeArea.id
  ctx.set('Location', `/api/knowledgeAreas/${id}`)
  ctx.body = newKnowledgeArea
}

async function list(ctx) {
  const pagination = ctx.state.pagination
  let query = KnowledgeArea
  const description = ctx.query.description
  if (description) {
    query = query.where('description', 'like', `%${description}%`)
  }
  try {
    if (pagination) {
      const { page, size } = pagination
      const result = await query.fetchPage({
        pageSize: size,
        page
      })
      paginateCtx(ctx, result.pagination)
      ctx.body = result
    } else ctx.body = await query.fetchAll()
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbFetch, {
      error: {
        rawErrorMessage: e.stack
      }
    })
  }
}

async function update(ctx) {
  const id = +ctx.params.id
  const payload = ctx.request.body
  let ka = await KnowledgeArea.where({ id }).fetch()
  if (ka) {
    try {
      ka = await KnowledgeArea.where({ id }).save(payload, {
        patch: true
      })
      ctx.body = ka
      ctx.status = HttpCodes.OK
    } catch (e) {
      ctx.throw(HttpCodes.INT_SRV_ERROR, MessageCodes.error.errOnDbSave)
    }
  } else {
    ctx.throw(
      HttpCodes.BAD_REQUEST,
      MessageCodes.error.errEntityDoesNotExist('knowledgeArea')
    )
  }
}

async function del(ctx) {
  const id = +ctx.params.id
  const existingKa = await KnowledgeArea.where({ id }).fetch()
  if (!existingKa) {
    ctx.throw(
      HttpCodes.BAD_REQUEST,
      MessageCodes.error.errEntityDoesNotExist('knowledgeArea')
    )
    return
  }
  try {
    await KnowledgeArea.where({ id }).destroy()
    ctx.status = HttpCodes.OK
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbSave)
  }
}

module.exports = { create, list, update, del }
