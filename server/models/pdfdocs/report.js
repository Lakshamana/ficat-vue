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
    data: (Array[][]) query result
  }
  @param {Boolean} hasChoosenAcdUnity if user has not queried by academic unity
*/
function generateReport(doc, queryData, hasChoosenAcdUnity) {
  const { searchType, params, data } = queryData
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

  const fontSize = 10
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

  // Sort rows by register amount if hasChoosenAcdUnity = true
  hasChoosenAcdUnity && data.sort((x, y) => x[2] - y[2])
  const labels = data.map(row => row[0])
  for (const i in labels) {
    posY = offset + offsetFactor * i
    row(doc, posY)
    rowText(doc, labels[i], posY + 10)
  }

  doc.lineCap('butt')
  row(doc, 120)
  doc.fontSize(12)
  const headers = tableHeader[searchType]
  for (let i = 0; i < headers.length; i++) {
    const colWidth = getColumnWidth()
    rowText(doc, headers[i], 130, i, colWidth)
    if (i === headers.length - 1) break
    console.log(i)
    createCol(doc, (i + 1) * colWidth, 120, posY + offsetFactor)
  }
}

function createCol(doc, startX, startOffsetY, endOffsetY) {
  console.log('create col')
  doc
    .moveTo(startX, startOffsetY)
    .lineTo(startX, endOffsetY)
    .stroke()
}

function rowText(doc, text, heigth, col, colWidth) {
  doc.y = heigth - 5
  doc.x = 30 + col * colWidth || 30
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
