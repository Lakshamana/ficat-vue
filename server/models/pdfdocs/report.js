const path = require('path')

const tableHeader = {
  monthly: ['Und. Acadêmica', 'Quantidade'],
  semiannualy: ['Und. Acadêmica', 'Quantidade'],
  annually: ['Und. Acadêmica', 'Sigla', 'Quantidade']
}

/**
 * Generates report's PDF
 * @param {PDFKit.PDFDocument} doc
 * @param {Object} queryData = {
    searchType: (String) ['monthly' || 'semiannualy' || 'annually'],
    params: (Object) {
      year,
      month,
      semester,
      unityId,
      type,
      courseId
    },
    data: (String|Object) query result
  }
  @param {Array} acdUnities if user has not queried by academic unity
*/
function generateReport(doc, queryData, acdUnities) {
  const { searchType, params } = queryData
  doc.registerFont(
    'Arial',
    path.resolve(__dirname, '../../../assets/fonts/arimo.regular.ttf')
  )

  const paramsPrettyNames = {
    year: 'Ano',
    // month: 'Mês',
    // semester: 'Semestre',
    unityId: 'Unidade acadêmica',
    type: 'Tipo de curso',
    courseId: 'Curso'
  }

  const fontSize = 12
  const header =
    'Pesquisa por registros de fichas catalográficas com os seguintes parâmetros:'
  doc.font('Arial', fontSize).text(header, {
    align: 'center'
  })
  const paramList = Object.entries(params).map(
    ([k, v]) => paramsPrettyNames[k] + ': ' + v
  )
  doc.moveDown(1)
  doc.list(paramList)

  const offsetFactor = 20
  const offset = 120 + offsetFactor * paramList.length
  let posY = 0

  const headers = tableHeader[searchType]
  row(doc, 120)
  for (const i in headers) {
    rowText(doc, headers[i], 130, i)
    console.log(headers[i])
  }

  const searchTypeLabels = labelMap(acdUnities)
  const labels = searchTypeLabels[searchType]

  for (const i in labels) {
    posY = offset + offsetFactor * i
    row(doc, posY)
    rowText(doc, labels[i], posY + 10)
  }

  doc
    .lineCap('butt')
    .moveTo(180, offset)
    .lineTo(180, posY + offsetFactor)
    .moveTo(360, offset)
    .lineTo(360, posY + offsetFactor)
    .stroke()
}

/**
 *
 * @param {Array} acdUnities
 */
function labelMap(acdUnities) {
  return {
    monthly: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ],
    semiannually: ['1º semestre', '2º semestre'],
    annually: acdUnities.length ? acdUnities.map(u => u.name) : ['Total Anual']
  }
}

function rowText(doc, text, heigth, col) {
  doc.y = heigth - 5
  doc.x = col * 180 || 30
  doc.fillColor('black')
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: 'justify',
    columns: 1
  })
  return doc
}

function row(doc, heigth) {
  doc
    .lineJoin('miter')
    .rect(30, heigth, 500, 20)
    .stroke()
  return doc
}

module.exports = generateReport
