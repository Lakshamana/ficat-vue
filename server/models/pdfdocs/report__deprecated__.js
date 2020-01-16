/**
 * @deprecated
 */

const path = require('path')

const tableHeader = {
  monthly: ['Und. Acadêmica', 'Quantidade'],
  semiannualy: ['Und. Acadêmica', 'Quantidade'],
  annually(habemusAcdUnity) {
    return habemusAcdUnity
      ? ['Total Anual']
      : ['Und. Acadêmica', 'Sigla', 'Quantidade']
  }
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
  console.log('DATA:')
  console.log(data)
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
  // const offset = 120 + offsetFactor * paramList.length
  const posY = 0

  doc.lineCap('butt')
  row(doc, 120)
  doc.fontSize(12)
  const colWidths = []
  const maxLen = 540
  const headers = tableHeader[searchType]
  for (let i = 0; i < headers.length; i++) {
    console.log('before bug')
    rowText(doc, headers[i], 130, i, colWidths)
    if (i === headers.length - 1) break
    const x = (maxLen - doc.x) / (headers.length - i)
    createCol(doc, x, 120, posY + offsetFactor)
  }

  // Sort rows by register amount if hasChoosenAcdUnity = true
  // hasChoosenAcdUnity && data.sort((x, y) => x[2] - y[2])
  // for (let i = 0; i < data.length; i++) {
  //   posY = offset + offsetFactor * i
  //   row(doc, posY)
  //   for (let j = 0; j < data[0].length; j++) {
  //     rowText(doc, data[i][j], posY + 10, j, colWidths)
  //   }
  // }
}

// /**
//  *
//  * @param {Array[][]} data
//  * @param {Number} i
//  * @param {Number} pixelFactor
//  */
// function getColumnWidth(data, i, pixelFactor = 7) {
//   const widerLabel = data.reduce((x, y) => (x[i].length > y[i].length ? x : y))
//   console.log(widerLabel[i])
//   return pixelFactor * widerLabel[i].length
// }

function createCol(doc, startX, startOffsetY, endOffsetY) {
  console.log('create col')
  doc
    .moveTo(startX, startOffsetY)
    .lineTo(startX, endOffsetY)
    .stroke()
}

// function getAccWidths(widths, col) {
//   let accWidths = 0
//   for (let i = 0; i <= col; i++) {
//     accWidths += widths[i]
//   }
//   return accWidths
// }

/**
 *
 * @param {PDFKit.PDFDocument} doc
 * @param {*} text
 * @param {*} heigth
 * @param {*} col
 * @param {*} colWidths
 */
function rowText(doc, text, heigth, col, colWidths) {
  doc.x = doc.x || 10
  doc.y = heigth - 5
  doc.fillColor('black')
  console.log('passed')
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: 'justify',
    columns: 1
  })
  doc.x += 10 + 7 * text.length
}

function row(doc, heigth) {
  doc
    .lineJoin('miter')
    .rect(30, heigth, 500, 20)
    .stroke()
}

module.exports = generateReport
