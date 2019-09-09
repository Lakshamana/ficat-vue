const CatalogCard = require('../models/CatalogCard')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

async function create(ctx) {
  const payload = ctx.request.body
  const cutter = payload.cutter
  const existingCatalogCard = await CatalogCard.where({ cutter }).fetch()
  if (existingCatalogCard) {
    ctx.throw(
      HttpCodes.BAD_REQUEST,
      MessageCodes.error.errEntityAlreadyExist('catalogCard')
    )
    return
  }
  ctx.status = HttpCodes.OK
  const newCatalogCard = await CatalogCard.forge(payload).save()
  ctx.set('Location', `/api/catalogCards/${cutter}`)
  ctx.body = newCatalogCard
}

async function list(ctx) {
  try {
    ctx.body = await CatalogCard.fetchAll()
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbFetch, {
      error: {
        rawErrorMessage: e
      }
    })
  }
}

async function update(ctx) {
  const cutter = ctx.params.cutter
  const payload = ctx.request.body
  let catalogCard = await CatalogCard.where({ cutter }).fetch()
  if (catalogCard) {
    try {
      catalogCard = await CatalogCard.where({ cutter }).save(payload, {
        patch: true
      })
      ctx.status = HttpCodes.OK
      ctx.body = catalogCard
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
      MessageCodes.error.errEntityDoesNotExist('catalogCard')
    )
  }
}

module.exports = { create, list, update }
