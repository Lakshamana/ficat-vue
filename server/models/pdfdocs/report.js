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
*/
function generateReport(doc, queryData) {
  // line to the middle
  doc
    .lineCap('butt')
    .moveTo(180, 90)
    .lineTo(180, 230)
    .moveTo(360, 90)
    .lineTo(360, 230)
    .stroke()

  row(doc, 90)
  row(doc, 110)
  row(doc, 130)
  row(doc, 150)
  row(doc, 170)
  row(doc, 190)
  row(doc, 210)

  rowText(doc, 'Nombre o razón social', 100)
  rowText(doc, 'RUT', 120)
  rowText(doc, 'Dirección', 140)
  rowText(doc, 'Comuna', 160)
  rowText(doc, 'Ciudad', 180)
  rowText(doc, 'Telefono', 200)
  rowText(doc, 'e-mail', 220)
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
