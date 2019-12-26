function generateReport(doc) {
  // line to the middle
  doc
    .lineCap('butt')
    .moveTo(270, 90)
    .lineTo(270, 230)
    .stroke()

  row(doc, 90)
  row(doc, 110)
  row(doc, 130)
  row(doc, 150)
  row(doc, 170)
  row(doc, 190)
  row(doc, 210)

  textInRowFirst(doc, 'Nombre o razón social', 100)
  textInRowFirst(doc, 'RUT', 120)
  textInRowFirst(doc, 'Dirección', 140)
  textInRowFirst(doc, 'Comuna', 160)
  textInRowFirst(doc, 'Ciudad', 180)
  textInRowFirst(doc, 'Telefono', 200)
  textInRowFirst(doc, 'e-mail', 220)

  function textInRowFirst(doc, text, heigth) {
    doc.y = heigth
    doc.x = 30
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
}

module.exports = generateReport
