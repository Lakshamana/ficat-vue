const PDFDocument = require('pdfkit')
const CatalogCard = require('../models/CatalogCard')
const KnowledgeArea = require('../models/KnowledgeArea')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')
const { validatePayload } = require('../../shared/utils')
const catalogCardModel = require('../models/pdfdocs/catalogCard')

const fields = {
  authors: ['authorName', 'authorSurname', 'authorSurname', 'author2Surname'],
  work: [
    'workTitle',
    'workSubtitle',
    'presentationYear',
    'workImagesType',
    'totalPages',
    'workType'
  ],
  advisors: [
    'advisorName',
    'advisorSurname',
    'isFemaleAdvisor',
    'advisorTitle',
    'coadvisorName',
    'coadvisorSurname',
    'isFemaleCoadvisor',
    'coadvisorTitle'
  ],
  academicDetails: ['acdUnity', 'knArea'],
  fonts: ['times', 'arial']
}

async function create(ctx) {
  // Validação interna do payload
  const {
    keywords,
    work,
    authors,
    advisors,
    academicDetails,
    catalogFont
  } = ctx.request.body
  Promise.all([
    validatePayload(authors, fields.authors),
    validatePayload(work, fields.work),
    validatePayload(advisors, fields.advisors),
    validatePayload(academicDetails, fields.academicDetails)
  ]).then(validations => {
    if (
      !validations.every(val => val.valid) ||
      !fields.fonts.includes(catalogFont) ||
      !keywords.length
    ) {
      ctx.throw(
        HttpCodes.BAD_REQUEST,
        MessageCodes.error.errInvalidCatalogFields
      )
    }
  })

  const cdd = await KnowledgeArea.where({
    id: academicDetails.knArea.id
  })
    .fetch()
    .get('code')

  // Criar o PDF
  const doc = new PDFDocument()
  catalogCardModel(doc, catalogFont, {
    cutter: 'cutter',
    authors,
    work,
    advisors,
    academicDetails,
    keywords,
    cdd
  })
  const title = 'ficha.pdf'
  doc.info.Title = title
  await doc.end()

  try {
    const payload = {
      type: work.workType,
      unityId: academicDetails.acdUnity,
      courseId: academicDetails.course
    }
    const newCatalogCard = await CatalogCard.forge(payload).save()
    ctx.set('Content-Type', 'application/pdf')
    ctx.set('Content-Disposition', `filename=${title}`)
    ctx.body = doc
    ctx.status = HttpCodes.OK
    const id = newCatalogCard.id
    ctx.set('Location', `/api/catalogCards/${id}`)
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbSave, {
      error: {
        rawErrorMessage: e
      }
    })
  }
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
  const id = +ctx.params.id
  const payload = ctx.request.body
  let catalogCard = await CatalogCard.where({ id }).fetch()
  if (catalogCard) {
    try {
      catalogCard = await CatalogCard.where({ id }).save(payload, {
        patch: true
      })
      ctx.body = catalogCard
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
      MessageCodes.error.errEntityDoesNotExist('CatalogCard')
    )
  }
}

module.exports = { create, list, update }
