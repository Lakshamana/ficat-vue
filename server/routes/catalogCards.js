const htmlPdf = require('html-pdf')

const CatalogCard = require('../models/CatalogCard')
const { knex } = require('../db')
const KnowledgeArea = require('../models/KnowledgeArea')
const Course = require('../models/Course')
const AcademicUnity = require('../models/AcademicUnity')

const { validatePayload, maybe } = require('../../shared/utils')
const { cutterFetch, labelMap } = require('../util/utils')

const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')
const { catalogFields } = require('../routeFieldsValidation')
const globalPdfConfig = require('../models/pdfdocs/globalPdfConfig')

const catalogCardModel = require('../models/pdfdocs/catalogCard')
const generatePdfReport = require('../models/pdfdocs/report')

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
    validatePayload(
      authors,
      catalogFields.authors.mandatory,
      catalogFields.authors.optional
    ),
    validatePayload(
      work,
      catalogFields.work.mandatory,
      catalogFields.work.optional
    ),
    validatePayload(
      advisors,
      catalogFields.advisors.mandatory,
      catalogFields.advisors.optional
    ),
    validatePayload(academicDetails, catalogFields.academicDetails)
  ]

  if (
    !validations.every(val => val.valid) ||
    !catalogFields.fonts.includes(catalogFont) ||
    !keywords.length
  ) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errInvalidFields, {
      fields: validations.filter(val => val && val.valid === false)
    })
  }

  // Consulta de dados para inserir no PDF
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

  const cutter = cutterFetch(authors.authorSurname, work.workTitle)
  try {
    const payload = {
      type: work.workType,
      unityId: academicDetails.acdUnityId,
      courseId: academicDetails.courseId
    }

    await CatalogCard.forge(payload).save()

    ctx.set('Content-Type', 'application/pdf')
    ctx.set('Content-Disposition', 'filename=ficha.pdf')

    const pdfResult = {
      catalogFont,
      cutter,
      authors,
      work,
      advisors,
      academicDetailNames,
      keywords,
      cdd
    }

    // Construir o PDF
    const htmlTemplate = catalogCardModel(catalogFont, pdfResult)
    const stream = await new Promise((resolve, reject) => {
      htmlPdf
        .create(
          htmlTemplate,
          Object.assign(globalPdfConfig, {
            border: {
              top: '4.25cm',
              right: '5cm',
              bottom: '4.25cm',
              left: '5cm'
            }
          })
        )
        .toStream((err, stream) => {
          if (err) {
            stream.close()
            reject(err)
          }
          resolve(stream)
        })
    })

    ctx.body = stream
    ctx.status = HttpCodes.OK
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbSave, {
      error: {
        rawErrorMessage: e.stack
      }
    })
  }
}

async function catalogQueries(ctx) {
  try {
    // Períodos requisitáveis: (mensal, semestral ou anual)
    const searchTypeQueries = {
      monthly: [fetchMonthly, 12],
      semiannually: [fetchSemiannually, 2],
      annually: [fetchAnnually, 1]
    }

    const searchType = ctx.query.searchType

    if (!searchTypeQueries[searchType]) {
      ctx.throw(HttpCodes.BAD_REQUEST, 'invalid searchType')
    }

    // ano é obrigatório (ex: 2019 (number))
    const { unityId, type, courseId } = ctx.query
    const year = +ctx.query.year

    // Primeiro filtrar por tipo, programa ou unidade acadêmica
    const optionalFilters = {
      ...maybe('unityId', unityId),
      ...maybe('type', type),
      ...maybe('courseId', courseId)
    }

    const [queryFn, expectedResultsNumber] = searchTypeQueries[searchType]
    let data
    const academicUnitiesQuery = await AcademicUnity.fetchAll()
    const academicUnities = academicUnitiesQuery.toJSON()

    const isAllUnitiesQuery = searchType === 'annually' && !unityId
    if (isAllUnitiesQuery) {
      data = await queryGroupByAcdUnity(year, optionalFilters)

      for (const acd of academicUnities) {
        if (!data[acd.id]) {
          data[acd.id] = 0
        }
      }
    } else {
      const result = await queryFn(year, optionalFilters)
      data = completeWithZeros(result, expectedResultsNumber)
    }

    // Se o usuário deseja obter um relatório em PDF
    const { pdf } = ctx.query
    if (pdf && pdf !== 'false') {
      const table = []
      const useAcademicUnities = isAllUnitiesQuery ? academicUnities : []
      const labels = labelMap(useAcademicUnities)[searchType]

      for (const i in labels) {
        const dataRow = isAllUnitiesQuery
          ? data[academicUnities[i].id]
          : data[i]
        const row = Array.isArray(labels[i])
          ? [...labels[i], '' + dataRow]
          : [labels[i], '' + dataRow]
        table.push(row)
      }

      const queryResult = { table, searchType }
      if (searchType !== 'annually' || !unityId) {
        const values = Object.values(data)
        queryResult.total = values.reduce((acc, cur) => acc + cur)
        if (searchType === 'monthly' || !unityId) {
          queryResult.mean = (queryResult.total / values.length).toPrecision(2)
        }
      }

      const acdUnity = academicUnities.find(u => u.id === +unityId)
      queryResult.params = {
        ...optionalFilters,
        ...maybe('unityId', acdUnity && acdUnity.name),
        year
      }

      const htmlTemplate = generatePdfReport(queryResult, !!unityId)
      const stream = await new Promise((resolve, reject) => {
        htmlPdf
          .create(htmlTemplate, globalPdfConfig)
          .toStream((err, stream) => {
            if (err) reject(err)
            resolve(stream)
          })
      })

      ctx.set('Content-Type', 'application/pdf')
      ctx.set('Content-Disposition', `filename=relatorio-${year}.pdf`)

      ctx.body = stream
      ctx.status = HttpCodes.OK
      return
    }

    ctx.body = data
    ctx.status = HttpCodes.OK
  } catch (err) {
    ctx.throw(HttpCodes.BAD_REQUEST, err)
  }
}

function completeWithZeros(dataset, n) {
  const base = {}
  for (let i = 0; i < n; ++i) {
    base[i] = dataset[i] || 0
  }
  return base
}

async function queryGroupByAcdUnity(year, optionalFilters) {
  const group = await knex('catalogCards')
    .select(knex.raw('unityId, count(*) as count'))
    .whereRaw(`year(datetime) = ${year}`)
    .where({ ...optionalFilters })
    .groupBy('unityId')

  return group.reduce(
    (acc, item) => ({ ...acc, [item.unityId]: item.count }),
    {}
  )
}

/**
 *
 * @param {number} year
 * @returns {Object} contagem mensal de ocorrências de fichas catalográficas
 */
async function fetchMonthly(year, filters) {
  const group = await knex('catalogCards')
    .select(knex.raw('month(datetime) as month, count(*) as count'))
    .whereRaw(`year(datetime) = ${year}`)
    .where({ ...filters })
    .groupBy('month')

  return group.reduce((acc, item) => ({ ...acc, [item.month]: item.count }), {})
}

/**
 *
 * @param {number} year
 * @returns {Object} contagem semestral de ocorrências de fichas catalográficas
 */
async function fetchSemiannually(year, filters) {
  const query = await knex('catalogCards')
    .select(
      knex.raw(
        `count(if(year(datetime) = ${year} and datetime <= '${year}-06-30', 1, NULL)) as '0',
        count(if(year(datetime) = ${year} and datetime > '${year}-06-30', 1, NULL)) as '1'`
      )
    )
    .where({ ...filters })
  return query[0]
}

async function fetchAnnually(year, filters) {
  console.log()
  const count = await knex('catalogCards')
    .select(knex.raw('count(*) as "0"'))
    .whereRaw(`year(datetime) = ${year}`)
    .where({ ...filters })
  return count[0]
}

async function list(ctx) {
  try {
    ctx.body = await CatalogCard.forge()
      .orderBy('datetime', 'ASC')
      .fetchAll()
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbFetch)
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
      ctx.throw(HttpCodes.INT_SRV_ERROR, MessageCodes.error.errOnDbSave)
    }
  } else {
    ctx.throw(
      HttpCodes.BAD_REQUEST,
      MessageCodes.error.errEntityDoesNotExist('CatalogCard')
    )
  }
}

async function getFirstCatalogCardYear(ctx) {
  try {
    const resultCollection = await CatalogCard.forge()
      .orderBy('datetime', 'ASC')
      .fetchAll()
    const oldest = resultCollection.first()
    ctx.body = {
      year: new Date(oldest.get('datetime')).getFullYear()
    }
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnDbFetch)
  }
}

/*
 * async function getReportPdf(ctx) {
 *   const { pdfToken } = ctx.query
 *
 *   if (!queryResults[pdfToken] || !pdfToken) {
 *     ctx.body = 'No data to for you to see here, close this window...'
 *     ctx.status = HttpCodes.BAD_REQUEST
 *     return
 *   }
 *
 *   ctx.set('Content-Type', 'application/pdf')
 *   ctx.set('Content-Disposition', 'filename=relatório.pdf')
 *
 *   const queryResult = queryResults[pdfToken]
 *   const acdUnities =
 *     !queryResult.params.unityId && (await AcademicUnity.fetchAll()).toJSON()
 *   const { searchType, data } = queryResult
 *   const table = []
 *   const labels = labelMap(acdUnities)[searchType]
 *   for (const i in labels) {
 *     const row = Array.isArray(labels[i])
 *       ? [...labels[i], '' + data[i]]
 *       : [labels[i], '' + data[i]]
 *     table.push(row)
 *   }
 *   // Sort descending first
 *   const last = table[0].length - 1
 *   queryResult.table = table.sort((rowA, rowB) => rowB[last] - rowA[last])
 *   if (!(searchType === 'annually') || !queryResult.params.unityId) {
 *     const values = Object.values(data)
 *     queryResult.total = values.reduce((acc, cur) => acc + cur)
 *     if (searchType === 'monthly' || !queryResult.params.unityId) {
 *       queryResult.mean = (queryResult.total / values.length).toPrecision(3)
 *     }
 *   }
 *   const htmlTemplate = generatePdfReport(
 *     queryResult,
 *     !!queryResult.params.unityId
 *   )
 *   const stream = await new Promise((resolve, reject) => {
 *     htmlPdf.create(htmlTemplate, globalPdfConfig).toStream((err, stream) => {
 *       if (err) reject(err)
 *       resolve(stream)
 *     })
 *   })
 *   ctx.body = stream
 *   // delete queryResults[pdfToken]
 *   ctx.status = HttpCodes.OK
 * }
 */

module.exports = {
  create,
  list,
  update,
  catalogQueries,
  getFirstCatalogCardYear
}
