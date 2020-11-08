const { join } = require('path')
const { readFileSync } = require('fs')

/**
 * Gera o modelo PDF baseado nos dados da
 * ficha catalográfica gerados pelo usuário final
 * @param {String} font
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
  catalogFont,
  { cutter, authors, work, advisors, academicDetailNames, keywords, cdd }
) {
  const header = `
  Dados Internacionais de Catalogação na Publicação (CIP) de acordo com ISBD
  Sistema de Bibliotecas da Universidade Federal do Pará.
  Gerada automaticamente pelo módulo Ficat, mediante os dados fornecidos pelo(a) autor(a)`

  const author2 = authors.author2Name
    ? `, ${authors.author2Name} ${authors.author2Surname}.`
    : '.'

  const color = {
    nocolor: '',
    color: ' : il. color',
    pb: ' : il. pb'
  }

  const subtitle = work.workSubtitle ? `: ${work.workSubtitle}` : ''
  const authorHeader = `${authors.authorSurname}, ${authors.authorName}`
  const workTitleHeader = `${work.workTitle} ${subtitle} / ${
    authors.authorName
  } ${authors.authorSurname}${author2} — ${work.presentationYear}`
  const pagesHeader = `${work.totalPages} f.${color[work.workImagesType]}`

  // Títulos em masculino e feminino
  const title = {
    graduate: ['', ''],
    expert: ['', ''],
    master: ['M.e ', 'M.ª '],
    doctor: ['Dr. ', 'Dra. ']
  }

  const femaleAdvisor = +!!advisors.isFemaleAdvisor
  const femaleCoadvisor = +!!advisors.isFemaleCoadvisor
  const advisorHeader = `Orientador(a): ${
    title[advisors.advisorTitle][femaleAdvisor]
  }${advisors.advisorName} ${advisors.advisorSurname}`
  const coadvisorHeader = advisors.coadvisorName
    ? `Coorientador(a): ${title[advisors.coadvisorTitle][femaleCoadvisor]} ${
        advisors.coadvisorName
      } ${advisors.coadvisorSurname}`
    : ''

  const fontSize = 10 // catalogFont === 'times' ? 9 : 10
  const withCoadvisorHeader = coadvisorHeader
    ? `<p class="ml">${coadvisorHeader}</p>`
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
  const keywordHeader = `${kws}. I. Título.`

  const templatePath = join(__dirname, 'catalogCard.html')

  const fontFamily =
    catalogFont === 'times' ? "'Noto Serif TC', serif" : "'Arimo', sans-serif"

  // HTML model and script should always have same file name
  const htmlTemplate = readFileSync(templatePath, 'utf8')

  return htmlTemplate
    .replace('__fontFamily__', fontFamily)
    .replace('__fontSize__', fontSize)
    .replace('{{cutter}}', cutter)
    .replace('{{header}}', header)
    .replace('{{authorHeader}}', authorHeader)
    .replace('{{workTitleHeader}}', workTitleHeader)
    .replace('{{pagesHeader}}', pagesHeader)
    .replace('{{advisorHeader}}', advisorHeader)
    .replace('{{coadvisorHeader}}', withCoadvisorHeader)
    .replace('{{workHeader}}', workHeader)
    .replace('{{localHeader}}', localHeader)
    .replace('{{keywordHeader}}', keywordHeader)
    .replace('{{cdd}}', cdd)
}

function getLocal(acdUnityName) {
  const arr = acdUnityName.split(' ')
  return arr[arr.length - 1]
}

module.exports = catalogCard
