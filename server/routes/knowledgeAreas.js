const KnowledgeArea = require('../models/KnowledgeArea')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

async function create(ctx) {
  const payload = ctx.request.body
  const code = payload.code
  const existingKa = await KnowledgeArea.where({ code }).fetch()
  if (existingKa) {
    ctx.throw(
      HttpCodes.BAD_REQUEST.code,
      MessageCodes.error.errEntityAlreadyExist('knowledgeArea')
    )
    return
  }
  ctx.status = HttpCodes.OK.code
  const newKnowledgeArea = await KnowledgeArea.forge(payload).save()
  const id = newKnowledgeArea.id
  ctx.set('Location', `/api/knowledgeAreas/${id}`)
  ctx.body = newKnowledgeArea
}

async function list(ctx) {
  const pagination = ctx.state.pagination
  if (pagination) {
    const { page, size } = pagination
    const result = await KnowledgeArea.fetchPage({
      pageSize: size,
      page
    })
    ctx.set('Pagination-Row-Count', result.pagination.rowCount)
    ctx.set('Pagination-Page-Count', result.pagination.pageCount)
    ctx.set('Pagination-Page', result.pagination.page)
    ctx.set('Pagination-Page-Size', result.pagination.pageSize)
    ctx.body = result
  } else ctx.body = await KnowledgeArea.fetchAll()
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
      ctx.status = HttpCodes.OK.code
    } catch (e) {
      ctx.throw(HttpCodes.INT_SRV_ERROR.code, MessageCodes.error.errOnDbSave)
    }
  } else {
    ctx.throw(
      HttpCodes.BAD_REQUEST.code,
      MessageCodes.error.errEntityDoesNotExist('knowledgeArea')
    )
  }
}

async function del(ctx) {
  const id = +ctx.params.id
  const existingKa = await KnowledgeArea.where({ id }).fetch()
  if (!existingKa) {
    ctx.throw(
      HttpCodes.BAD_REQUEST.code,
      MessageCodes.error.errEntityDoesNotExist('knowledgeArea')
    )
    return
  }
  try {
    await KnowledgeArea.where({ id }).destroy()
    ctx.status = HttpCodes.OK.code
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST.code, MessageCodes.error.errOnDbSave)
  }
}

module.exports = { create, list, update, del }
