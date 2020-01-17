const { join, resolve } = require('path')
const { readFileSync } = require('fs')

/**
 * Generates report's PDF
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
    table: (Array[][]) query result
  }
  @param {Boolean} hasChoosenAcdUnity if user has not queried by academic unity
*/
function generateReport(queryData, hasChoosenAcdUnity) {
  const { searchType, params, table } = queryData
  console.log(table, searchType)
  const tableHeaders = {
    monthly: ['Unidade Acadêmica', 'Quantidade'],
    semiannually: ['Unidade Acadêmica', 'Quantidade'],
    annually: hasChoosenAcdUnity
      ? ['Total Anual']
      : ['Und. Acadêmica', 'Sigla', 'Quantidade']
  }

  const paramsPrettyNames = {
    // month: 'Mês',
    // semester: 'Semestre',
    unityId: 'Unidade acadêmica',
    type: 'Tipo de curso',
    courseId: 'Curso'
  }

  const paramList = Object.entries(params)
    .filter(([k, v]) => k !== 'year')
    .map(([k, v]) => paramsPrettyNames[k] + ': ' + v)

  const withParameters = paramList.length ? ', com parâmetros:' : ''

  const templatePath = join(__dirname, 'report.html')

  // HTML model and script should always have same file name
  let htmlTemplate = readFileSync(templatePath, 'utf8')

  const img = join('file://', __dirname, 'img/bibcentral-logo.png')
  const fontUrl = resolve(
    'file://',
    __dirname,
    '../../../assets/fonts/arimo.regular.ttf'
  )

  htmlTemplate = htmlTemplate
    .replace('{{fontUrl}}', fontUrl)
    .replace('{{bibUfpaLogo}}', img)
    .replace('{{ficatLogo}}', img)
    .replace('{{sibiLogo}}', img)
    .replace('{{baseYear}}', params.year)
    .replace('{{withParameters}}', withParameters)
    .replace('{{paramList}}', renderParamList(paramList))
    .replace('{{tableHeader}}', renderTableHeader(tableHeaders[searchType]))
    .replace('{{tableBody}}', renderTableBody(table))
  return htmlTemplate
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
  for (let i = 0; i < table.length; i++) {
    s += '<tr>'
    for (let j = 0; j < table[0].length; j++) {
      s += '<td>' + table[i][j] + '</td>'
    }
    s += '</tr>'
  }
  return s
}

module.exports = generateReport
