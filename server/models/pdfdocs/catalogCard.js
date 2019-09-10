/**
 * Gera o modelo PDF baseado nos dados da
 * ficha catalográfica gerados pelo usuário final
 * @param {PDFKit.PDFDocument} doc
 * @param {Object} {
 *  cutter: String
 *  writer: {
 *    name: String,
 *    surname: String,
 *    course: String,
 *    institute: String
 *  },
 *  advicer: {name: String, surname: String, title: String},
 *  coadvicer: {name: String, surname: String, title: String},
 *  work: {
 *    title: String,
 *    subtitle: String,
 *    year: String,
 *    totalPages: String,
 *    type: String
 *  },
 *  keywords: String[],
 *  cdd: String
 * }
 */
function catalogCard(
  doc,
  { cutter, writer, advicer, coadvicer, work, keywords, cdd }
) {
  doc.moveDown(20)

  const header = `
Dados Internacionais de Catalogação na Publicação (CIP) de acordo com ISBD
Sistema de Bibliotecas da Universidade Federal do Pará
Gerada automaticamente pelo módulo Ficat, mediante os dados fornecidos pelo(a) autor(a)`

  doc.font('Times-Bold', 10).text(header, {
    align: 'center',
    continued: true
  })

  function drawLine(doc, x, y, length) {
    doc
      .lineWidth(2)
      .moveTo(x, y)
      .lineTo(x + length, y)
      .stroke()
  }

  drawLine(doc, 90, 425, 430)

  doc
    .font('Times-Roman', 10)
    .text(cutter, -270, 450, {
      align: 'justify'
    })
    .text(` ${writer.surname}, ${writer.name}`, 150, 450)
    .text(`   ${work.title} - ${writer.name} ${writer.surname}. — ${work.year}`)
    .text(` ${work.totalPages} f.`)

  const advicerHeader = `Orientador(a): ${advicer.title} ${advicer.name} ${advicer.surname}`
  const coadvicerHeader = `Coorientador(a): ${coadvicer.title} ${coadvicer.name} ${coadvicer.surname}`

  const workHeader = `${work.type} - ${writer.course}`

  const localHeader = `${writer.institute}, Universidade Federal do Pará, Belém, 2019.`

  let kws = ''
  for (const kn in keywords) {
    kws += `${kn + 1}. ${keywords[kn]}`
  }
  const keywordHeader = `${kws} . I. ${work.title}.`

  doc
    .moveDown(1)
    .text('   ' + advicerHeader)
    .text('   ' + coadvicerHeader)
    .text('   ' + workHeader, {
      width: 300
    })
    .text(localHeader, {
      width: 300
    })
    .moveDown(0.5)
    .text(keywordHeader, {
      width: 300
    })

  doc.moveDown(1).text(cdd, 520 - cdd.length * 5.5)

  drawLine(doc, 90, 610, 430)
}

module.exports = catalogCard
