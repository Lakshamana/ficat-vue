const path = require('path')
const { execSync } = require('child_process')
const { sign, verify, decode } = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const HttpCodes = require('../httpCodes')
const { MessageCodes } = require('../../shared/messageCodes')

// Default exp = 4h
const TIMEOUT = 60 * 60 * 4

async function tokenSign(user, rememberMe, expiresIn = TIMEOUT) {
  const exp = Math.floor(Date.now() / 1000) + expiresIn
  const xsrfToken = await hash(JSON.stringify(user))
  return {
    accessToken: sign(
      { user, exp, rmb: !!rememberMe, xsrfToken },
      process.env.JWT_SECRET
    ),
    xsrfToken
  }
}

/* RememberMe prolonga a expiração para 24h (default)
 * Verificar o token recebido no header contra o xsrfToken no JWT
 */
function tokenVerify(token, xsrfToken, rememberMeFactor = 6) {
  const tokenPayload = decode(token, { json: true })
  const maxAge = tokenPayload.rmb ? TIMEOUT * rememberMeFactor : TIMEOUT
  if (!tokenPayload.xsrfToken === xsrfToken) {
    throw new Error('invalid xsrf token')
  }
  return verify(token, process.env.JWT_SECRET, { maxAge })
}

function payloadErrors(ctx, validationResult) {
  // Validação não-vazia com erros
  ctx.status = HttpCodes.BAD_REQUEST
  const errorMessages = []
  for (const i in validationResult) {
    if (i === 'valid') continue
    errorMessages.push({
      errCode: MessageCodes.error[i],
      fields: `${validationResult[i].join(', ')}`
    })
  }
  ctx.throw(HttpCodes.BAD_REQUEST, MessageCodes.error.errOnPayloadValidation, {
    errors: errorMessages
  })
}

function paginateCtx(ctx, pagination) {
  ctx.set('Pagination-Row-Count', pagination.rowCount)
  ctx.set('Pagination-Page-Count', pagination.pageCount)
  ctx.set('Pagination-Page', pagination.page)
  ctx.set('Pagination-Page-Size', pagination.pageSize)
}

async function hash(data) {
  const result = await bcrypt.hash(data, 12)
  return result
}

const stopwords = [
  'o',
  "'",
  '"',
  'a',
  'os',
  'as',
  'um',
  'uns',
  'uma',
  'umas',
  'de',
  'do',
  'da',
  'dos',
  'das',
  'no',
  'na',
  'nos',
  'nas',
  'ao',
  'aos',
  'à',
  'às',
  'pelo',
  'pela',
  'pelos',
  'pelas',
  'duma',
  'dumas',
  'dum',
  'duns',
  'num',
  'numa',
  'nuns',
  'numas',
  'com',
  'por',
  'em'
]

const diacritics = {
  a: 'áàãẫâåäæ',
  e: 'éèẽêë',
  i: 'îíìĩï',
  o: 'óòõôöø',
  u: 'úùûü'
}

/**
 * Dado um sobrenome, busca na tabela cutter o sobrenome
 * e retorna o código cutter
 * @param {String} surname
 * @returns {Promise<String>} cutter code
 */
function cutterFetch(surname, workTitle) {
  // Substituir caracteres unicode por ascii
  ;[surname, workTitle] = [surname, workTitle].map(word => {
    const lower = word[0].toLowerCase()
    for (const group in diacritics) {
      if (diacritics[group].includes(lower))
        return group.toUpperCase() + word.substring(1)
    }
    return word
  })

  // Fatiar por espaços
  const chunks = surname.split(' ')
  let s

  // Obter o primeiro componente do sobrenome
  // que não for uma stopword
  for (const c of chunks) {
    if (!stopwords.includes(c)) {
      s = c
      break
    }
  }

  const file = path.resolve(__dirname, '../../static/cutter.txt')

  /**
   * Caso o código para o componente do sobrenome não tenha um código,
   * retire a letra final e repita o processo.
   * Caso contrário, resolva a promise passando o valor encontrado
   */
  while (true) {
    // grep -w: exact match
    const code = execSync(
      `cat ${file} | grep -w ${s} | awk '{print $1}' | tr -d "\n"`,
      {
        encoding: 'utf-8'
      }
    )
    if (code) {
      // e.g. 'S' + 677 + 't', para surname = 'Sobrenome' e workTitle = 'Trabalho'
      const result = s[0].toUpperCase() + code + workTitle[0].toLowerCase()
      console.log('worktitle: ' + workTitle)
      return result
    } else s = s.substring(0, s.length - 1)
  }
}

/**
 *
 * @param {Array[]} acdUnities
 */
function labelMap(acdUnities) {
  return {
    monthly: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ],
    semiannually: ['1º semestre', '2º semestre'],
    annually: acdUnities.length
      ? acdUnities.map(u => [u.name, u.acronym])
      : ['Total Anual']
  }
}

module.exports = {
  paginateCtx,
  tokenSign,
  tokenVerify,
  payloadErrors,
  hash,
  cutterFetch,
  labelMap
}
