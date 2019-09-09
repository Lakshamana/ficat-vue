const PDFDocument = require('pdfkit')

const doc = new PDFDocument()
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

const incognito = 's677t'
const writerName = 'NOME'
const writerSurname = 'SOBRENOME'
const title = 'TÍTULO'
const year = 2019
const pageNumber = 'NÚMERO DE FOLHAS'

doc
  .font('Times-Roman', 10)
  .text(incognito, -270, 450, {
    align: 'justify'
  })
  .text(` ${writerSurname}, ${writerName}`, 150, 450)
  .text(`   ${title} - ${writerName} ${writerSurname}. — ${year}`)
  .text(` ${pageNumber} f.`)

const advicerName = 'Orientador'
const advicerSurname = 'Sobrenome do Orientador'
const advicerHeader = `Orientador(a): Prof. Dr. ${advicerName} ${advicerSurname}`

const course =
  'Licenciatura Integrada em Educação em Ciências, Matemáticas e Linguagens'
const workType = 'Trabalho de Conclusão de Curso (Graduação)'
const workHeader = `${workType} - ${course}`

const instituteName = 'Instituto de Educação Matemática e Científica'
const localHeader = `${instituteName}, Universidade Federal do Pará, Belém, 2019.`

const kw = ['ASDASDASD']
const keywordHeader = `1. ${kw[0]} . I. Título.`

doc
  .moveDown(1)
  .text('   ' + advicerHeader)
  .text('   ' + workHeader, {
    width: 300
  })
  .text(localHeader, {
    width: 300
  })
  .moveDown(0.5)
  .text(keywordHeader)

const cdd = 'CDD 004'

doc.moveDown(1).text(cdd, 430 + 90 - cdd.length * 5.5)

drawLine(doc, 90, 610, 430)
