const path = require('path')

/**
 * Gera o modelo PDF baseado nos dados da
 * ficha catalográfica gerados pelo usuário final
 * @param {PDFKit.PDFDocument} doc
 * @param {Object} {
 *  cutter: String
 *  authors: {
      authorName: String,
      authorSurname: String,
      author2Name: String,
      author2Surname: String
    },
    work: {
      workTitle: String,
      workSubtitle: String,
      presentationYear: String,
      workImagesType: String,
      totalPages: String,
      workType: String
    },
    advisors: {
      advisorName: String,
      advisorSurname: String,
      isFemaleAdvisor: Boolean,
      advisorTitle: String,
      coadvisorName: String,
      coadvisorSurname: String,
      isFemaleCoadvisor: Boolean,
      coadvisorTitle: String
    },
    academicDetailNames: {
      programName: String,
      acdUnityName: String
    },
    cdd: String
 */
function catalogCard(
  doc,
  font,
  { cutter, authors, work, advisors, academicDetailNames, keywords, cdd }
) {
  doc.registerFont(
    'Arial-Regular',
    path.resolve(__dirname, '../../../assets/fonts/arimo.regular.ttf')
  )
  doc.registerFont(
    'Arial-Bold',
    path.resolve(__dirname, '../../../assets/fonts/arimo.bold.ttf')
  )

  const defaultFont = `${font === 'times' ? 'Times' : 'Arial'}`
  const regularSuffix = `${font === 'times' ? '-Roman' : '-Regular'}`
  const fontSize = font === 'times' ? 10 : 9

  doc.moveDown(20)

  const header = `
Dados Internacionais de Catalogação na Publicação (CIP) de acordo com ISBD
Sistema de Bibliotecas da Universidade Federal do Pará
Gerada automaticamente pelo módulo Ficat, mediante os dados fornecidos pelo(a) autor(a)`

  doc.font(`${defaultFont}-Bold`, fontSize).text(header, {
    align: 'center',
    continued: true
  })

  drawLine(doc, 90, 425, 430)

  const subtitle = work.workSubtitle ? `: ${work.workSubtitle}` : ''

  const author2 = authors.author2Name
    ? `, ${authors.author2Name} ${authors.author2Surname}.`
    : '.'

  const color = {
    nocolor: '',
    color: ' : il. color',
    pb: ' : il. pb'
  }

  doc
    .font(`${defaultFont}${regularSuffix}`, fontSize)
    .text(cutter, -300, 450)
    .text(` ${authors.authorSurname}, ${authors.authorName}`, 150, 450)
    .text(
      `  ${work.workTitle} ${subtitle} / ${authors.authorName} ${authors.authorSurname}${author2} — ${work.presentationYear}`
    )
    .text(` ${work.totalPages} f.${color[work.workImagesType]}`)

  // Títulos em masculino e feminino
  const title = {
    graduate: ['', ''],
    expert: ['', ''],
    master: ['M.e ', 'M.ª '],
    doctor: ['Dr. ', 'Dra. ']
  }

  const femaleAdvisor = +advisors.isFemaleAdvisor
  const femaleCoadvisor = +advisors.isFemaleCoadvisor
  const advisorHeader = `Orientador(a): ${title[advisors.advisorTitle][femaleAdvisor]}${advisors.advisorName} ${advisors.advisorSurname}`
  const coadvisorHeader = advisors.coadvisorName
    ? `Coorientador(a): ${title[advisors.coadvisorTitle][femaleCoadvisor]} ${advisors.coadvisorName} ${advisors.coadvisorSurname}`
    : ''

  const workTypes = {
    thesis: 'Tese',
    dissertation: 'Dissertação',
    tccExpert: 'TCC (Especialização)',
    tccGraduation: 'TCC (Graduação)'
  }

  const workHeader = `${workTypes[work.workType]} - ${
    academicDetailNames.programName
  }, ${academicDetailNames.acdUnityName}`

  const local = academicDetailNames.acdUnityName.includes('Campus')
    ? getLocal(academicDetailNames.acdUnityName)
    : 'Belém'
  const localHeader = `Universidade Federal do Pará, ${local}, 2019.`

  let kws = ''
  for (const kn in keywords) {
    kws += `${+kn + 1}. ${keywords[kn]} `
  }
  kws = kws.substring(0, kws.length - 1)
  const keywordHeader = `${kws}. I. ${work.workTitle}.`

  doc
    .moveDown(1)
    .text('   ' + advisorHeader)
    .text(coadvisorHeader ? '   ' + coadvisorHeader : '')
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

  doc.moveDown(1).text(`CDD ${cdd}`, 500 - cdd.length * 7)

  drawLine(doc, 90, 610, 430)
}

function getLocal(acdUnityName) {
  const arr = acdUnityName.split('')
  return arr[arr.length - 1]
}

function drawLine(doc, x, y, length) {
  doc
    .lineWidth(2)
    .moveTo(x, y)
    .lineTo(x + length, y)
    .stroke()
}

module.exports = catalogCard
