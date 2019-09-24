const PDFDocument = require('pdfkit')
const CatalogCard = require('../models/CatalogCard')
const KnowledgeArea = require('../models/KnowledgeArea')
const Course = require('../models/Course')
const AcademicUnity = require('../models/AcademicUnity')
const HttpCodes = require('../httpCodes')
const { MessageCodes } = require('../../shared/messageCodes')
const { validatePayload } = require('../../shared/utils')
const catalogCardModel = require('../models/pdfdocs/catalogCard')
const { payloadErrors } = require('../util/utils')

const fields = {
  authors: {
    mandatory: ['authorName', 'authorSurname', 'author2Name', 'author2Surname'],
    optional: ['author2Name', 'author2Surname']
  },
  work: {
    mandatory: [
      'workTitle',
      'workSubtitle',
      'presentationYear',
      'workImagesType',
      'totalPages',
      'workType'
    ],
    optional: ['workSubtitle']
  },
  advisors: {
    mandatory: [
      'advisorName',
      'advisorSurname',
      'isFemaleAdvisor',
      'advisorTitle',
      'coadvisorName',
      'coadvisorSurname',
      'isFemaleCoadvisor',
      'coadvisorTitle'
    ],
    optional: [
      'coadvisorName',
      'coadvisorSurname',
      'isFemaleCoadvisor',
      'coadvisorTitle'
    ]
  },
  academicDetails: ['acdUnityId', 'knAreaId', 'courseId'],
  fonts: ['times', 'arial']
}

let pdfResult
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

  const validations = [
    validatePayload(authors, fields.authors.mandatory, fields.authors.optional),
    validatePayload(work, fields.work.mandatory, fields.work.optional),
    validatePayload(
      advisors,
      fields.advisors.mandatory,
      fields.advisors.optional
    ),
    validatePayload(academicDetails, fields.academicDetails)
  ]

  if (
    !validations.every(val => val.valid) ||
    !fields.fonts.includes(catalogFont) ||
    !keywords.length
  ) {
    ctx.throw(
      HttpCodes.BAD_REQUEST,
      MessageCodes.error.errInvalidCatalogFields,
      {
        fields: validations.filter(val => val && val.valid === false)
      }
    )
  }

  // Construir o PDF
  const kna = await KnowledgeArea.where({
    id: academicDetails.knAreaId
  }).fetch()
  const cdd = kna.get('code')

  const course = await Course.where({
    id: academicDetails.courseId
  }).fetch()

  const acdUnity = await AcademicUnity.where({
    id: academicDetails.acdUnityId
  }).fetch()

  const academicDetailNames = {
    programName: course.get('name'),
    acdUnityName: acdUnity.get('name')
  }

  const doc = new PDFDocument()
  catalogCardModel(doc, catalogFont, {
    cutter: 'cutter',
    authors,
    work,
    advisors,
    academicDetailNames,
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
    ctx.body = newCatalogCard
    ctx.status = HttpCodes.OK
    pdfResult = doc
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

const querieFields = {
  monthly: {
    mandatory: ['year', 'month', 'acdUnity', 'type', 'program'],
    optional: ['acdUnity', 'type', 'program']
  },
  semiannually: {
    mandatory: ['year', 'semester', 'acdUnity', 'type', 'program'],
    optional: ['acdUnity', 'type', 'program']
  },
  anually: {
    mandatory: ['year', 'acdUnity', 'type', 'program'],
    optional: ['acdUnity', 'type', 'program']
  }
}

function catalogQueries(ctx) {
  // let query = CatalogCard
  const searchType = ctx.query.type
  const params = ctx.request.body

  const { mandatory, optional } = querieFields[searchType]
  const validation = validatePayload(params, mandatory, optional)
  if (!validation.valid) {
    payloadErrors(ctx, validation)
  }
}

function getPdfResult(ctx) {
  ctx.set('Content-Type', 'application/pdf')
  ctx.set('Content-Disposition', `filename=${pdfResult.info.Title}`)
  if (!pdfResult) {
    ctx.status = HttpCodes.NOT_FOUND
    ctx.body = 'PDF already downloaded, please close this window.'
    return
  }
  ctx.status = HttpCodes.OK
  ctx.body = pdfResult
  pdfResult = undefined
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

module.exports = { create, list, update, getPdfResult, catalogQueries }
