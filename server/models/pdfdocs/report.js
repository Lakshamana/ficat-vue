const { join } = require('path')
const { readFileSync } = require('fs')

/**
 * Generates report's PDF
 * @param {Object} queryData = {
    searchType: (String) ['monthly' || 'semiannualy' || 'annually'],
    params: (Object) {
      year,
      unityId,
      type,
      courseId
    },
    table: (Array[][]) query result
  }
  @param {Boolean} hasChoosenAcdUnity if user has not queried by academic unity
*/
function generateReport(queryData, hasChoosenAcdUnity) {
  const { searchType, params, table, total, mean } = queryData
  const tableHeaders = {
    monthly: ['Unidade Acadêmica', 'Quantidade'],
    semiannually: ['Unidade Acadêmica', 'Quantidade'],
    annually: hasChoosenAcdUnity
      ? ['Total Anual']
      : ['Unidade Acadêmica', 'Sigla', 'Quantidade']
  }

  const paramsPrettyNames = {
    unityId: 'Unidade acadêmica',
    type: 'Tipo de curso',
    courseId: 'Curso'
  }

  const paramList = Object.entries(params)
    .filter(([k]) => k !== 'year')
    .map(([k, v]) => paramsPrettyNames[k] + ': ' + v)

  const withParameters = paramList.length ? ', com parâmetros:' : ''

  const stats = []
  total && stats.push(['TOTAL:', total])
  mean && stats.push(['MÉDIA:', mean])

  const withTableFooter = stats.length
    ? renderTableFooter(stats, tableHeaders[searchType])
    : ''

  const templatePath = join(__dirname, 'report.html')

  // HTML model and script should always have same file name
  const htmlTemplate = readFileSync(templatePath, 'utf8')

  // A hospedagem dessas imagens poderia ser melhorada
  // const hostPreffix = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/`
  const hostPreffix =
    'https://raw.githubusercontent.com/Lakshamana/ficat-vue/master/assets/'
  const img1 = hostPreffix + 'img/bibcentral-logo.png'
  const img2 = hostPreffix + 'img/ficat-logo.png'
  const img3 = hostPreffix + 'img/sibi-logo.png'

  return htmlTemplate
    .replace('{{bibUfpaLogo}}', img1)
    .replace('{{ficatLogo}}', img2)
    .replace('{{sibiLogo}}', img3)
    .replace('{{baseYear}}', params.year)
    .replace('{{withParameters}}', withParameters)
    .replace('{{paramList}}', renderParamList(paramList))
    .replace('{{tableHeader}}', renderTableHeader(tableHeaders[searchType]))
    .replace('{{tableBody}}', renderTableBody(table))
    .replace('{{withTableFooter}}', withTableFooter)
}

function renderParamList(paramList) {
  let s = '<ul>'
  for (const param of paramList) {
    s += `<li>${param}</li>`
  }
  return s + '</ul>'
}

function renderTableHeader(headers) {
  let s = '<tr>'
  for (const h of headers) {
    s += `<th>${h}</th>`
  }
  return s + '</tr>'
}

/**
 *
 * @param {Array[][]} table
 */
function renderTableBody(table) {
  let s = ''
  for (let i = 0; i < table.length; ++i) {
    s += '<tr>'
    for (let j = 0; j < table[0].length; ++j) {
      s += '<td>' + table[i][j] + '</td>'
    }
    s += '</tr>'
  }
  return s
}

/**
 *
 * @param {Number} total of catalog card count,
 * given the user query.
 * @param {Number} mean, present if
 * searchType === 'monthly' or
 * hasChoosenAcdUnity === true
 */
function renderTableFooter(stats, headers) {
  const offset = headers.length - stats[0].length
  let s = '<tfoot>'
  for (let i = 0; i < stats.length; ++i) {
    s += '<tr>'
    for (let j = 0; j < stats[0].length; ++j) {
      if (i === 0 && j === 0 && offset > 0) {
        s += `<td rowspan="${offset + 1}"></td>`
      }
      s += '<td>' + stats[i][j] + '</td>'
    }
    s += '</tr>'
  }

  return s + '</tfoot>'
}

module.exports = generateReport
