const PDFDocument = require('pdfkit')
const CatalogCard = require('../models/CatalogCard')
const KnowledgeArea = require('../models/KnowledgeArea')
const Course = require('../models/Course')
const AcademicUnity = require('../models/AcademicUnity')
const HttpCodes = require('../httpCodes')
const { MessageCodes } = require('../../shared/messageCodes')
const { validatePayload, chunks } = require('../../shared/utils')
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

// Períodos requisitáveis: (mensal, semestral ou anual)
const querieFields = {
  monthly: {
    mandatory: ['year', 'month', 'unityId', 'type', 'courseId'],
    optional: ['month', 'unityId', 'type', 'courseId']
  },
  semiannually: {
    mandatory: ['year', 'semester', 'unityId', 'type', 'courseId'],
    optional: ['semester', 'unityId', 'type', 'courseId']
  },
  annually: {
    mandatory: ['year', 'unityId', 'type', 'courseId'],
    optional: ['unityId', 'type', 'courseId']
  }
}

async function catalogQueries(ctx) {
  let query = CatalogCard
  const searchType = ctx.query.searchType
  const params = ctx.request.body
  console.log(params)

  const { mandatory, optional } = querieFields[searchType]
  const validation = validatePayload(params, mandatory, optional)
  if (!validation.valid) {
    payloadErrors(ctx, validation)
  }

  // ano é obrigatório (ex: 2019 (number))
  // semester = 0 ou 1 (1º ou 2º semestre, respectivamente)
  // month = número em [0, ..., 11]
  const { year, month, semester, unityId, type, courseId } = params

  // Primeiro filtrar por tipo, programa ou unidade acadêmica
  if (unityId) {
    query = query.where({ unityId })
  }
  if (type) {
    query = query.where({ type })
  }
  if (courseId) {
    query = query.where({ courseId })
  }

  // Construção do filtro temporal, comece pelo ano
  // const yearInitialDay = new Date(year, 0)
  // const yearFinalDay = new Date(year, 11, 31, 23, 59)
  // query = query
  //   .where('datetime', '>', yearInitialDay)
  //   .where('datetime', '<', yearFinalDay)

  // months = [0, ..., 11]
  const months = Array.from({ length: 12 }, (_, i) => i)
  const chunkSizeConvert = {
    monthly: 1,
    semiannually: 6,
    annually: 12
  }

  const responseObj = {}
  /* Filtre e conte por mês, semestre ou ano inteiro.
   * Em caso de ano inteiro, conte os registros e os
   * agrupe pelo período requisitado.
   */
  const groupedMonths = chunks(months, chunkSizeConvert[searchType])
  if (month) {
    console.log(1)
    responseObj.count = await getMonthCount(query, year, +month)
  } else if (semester) {
    console.log(2)
    responseObj.count = await getMonthGroupCount(
      query,
      year,
      groupedMonths[+semester]
    )
  } else {
    console.log(3)
    responseObj.count = {}
    // console.log(groupedMonths)
    for (const groupIdx in groupedMonths) {
      // console.log(groupedMonths[groupIdx])
      const f = await getMonthGroupCount(query, year, groupedMonths[groupIdx])
      // console.log(f)
      responseObj.count[groupIdx] = f
    }
  }

  ctx.status = HttpCodes.OK
  ctx.body = responseObj
}

/**
 *
 * @param {CatalogCard} model
 * @param {number} year
 * @param {Number[]} monthList
 * @returns {number} contagem de ocorrências de fichas catalográficas
 */
async function getMonthGroupCount(model, year, monthList) {
  const r = await monthList.reduce(
    async (m1, m2) =>
      (await getMonthCount(model, year, m1)) +
      (await getMonthCount(model, year, m2))
  )
  console.log('Total of ' + monthList + ' months: ' + r)
  return r
}

/**
 *
 * @param {CatalogCard} model
 * @param {number} year
 * @param {number} month: número entre 0 e 11
 * @returns {Promise<Number>}
 */
function getMonthCount(model, year, month) {
  const monthInitialDay = new Date(year, month, 1)
  const monthFinalDay = new Date(year, month + 1, 0)
  return model
    .where('datetime', '>', monthInitialDay)
    .where('datetime', '<', monthFinalDay)
    .count()
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
