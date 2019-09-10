/**
 * Gera o modelo PDF baseado nos dados da
 * ficha catalográfica gerados pelo usuário final
 * @param {PDFKit.PDFDocument} doc
 * @param {Object} {
 *  cutter: String
 *  authors: {
      authorName: String
      authorSurname: String
      author2Name: String
      author2Surname: String
    },
    work: {
      workTitle: String
      workSubtitle: String
      presentationYear: String
      workImagesType: String
      totalPages: String,
      workType: String
    },
    advisors: {
      advisorName: String
      advisorSurname: String
      isFemaleAdvisor: Boolean
      advisorTitle: String
      coadvisorName: String
      coadvisorSurname: String
      isFemaleCoadvisor: Boolean
      coadvisorTitle: String
    },
    academicDetails: {
      acdUnity: String
      knArea: String
      course: String
    },
 */
function catalogCard(
  doc,
  { cutter, authors, advisor, coadvisor, work, academicDetails, keywords, cdd }
) {
  doc.moveDown(20)

  const header = `
Dados Internacionais de Catalogação na Publicação (CIP) de acordo com ISBD
Sistema de Bibliotecas da Universidade Federal do Pará
Gerada automaticamente pelo módulo Ficat, mediante os dados fornecidos pelo(a) autor(a)`

  doc.font('Default-Bold', 10).text(header, {
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
    .font('Default-Regular', 10)
    .text(cutter, -270, 450, {
      align: 'justify'
    })
    .text(` ${authors.surname}, ${authors.name}`, 150, 450)
    .text(
      `   ${work.workTitle} - ${authors.name} ${authors.surname}. — ${work.presentationYear}`
    )
    .text(` ${work.totalPages} f.`)

  const advisorHeader = `Orientador(a): ${advisor.title} ${advisor.name} ${advisor.surname}`
  const coadvisorHeader = `Coorientador(a): ${coadvisor.title} ${coadvisor.name} ${coadvisor.surname}`

  const workHeader = `${work.workType} - ${academicDetails.course}`

  const localHeader = `${authors.institute}, Universidade Federal do Pará, Belém, 2019.`

  let kws = ''
  for (const kn in keywords) {
    kws += `${kn + 1}. ${keywords[kn]}`
  }
  const keywordHeader = `${kws} . I. ${work.workTitle}.`

  doc
    .moveDown(1)
    .text('   ' + advisorHeader)
    .text('   ' + coadvisorHeader)
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
