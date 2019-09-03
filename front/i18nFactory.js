import en from './i18n/en'
import pt from './i18n/pt'

const translation = {
  en,
  pt
}

const prefixes = {
  err: 'error',
  inf: 'info',
  lt: 'layout',
  msg: 'message'
}

/**
 * Obter tipo de validação baseado no prefixo
 * da chave
 * @param {String} key
 */
function getType(key) {
  for (const pfx in prefixes) {
    if (key.indexOf(pfx) === 0) return prefixes[pfx]
  }
}

// function translate(langKey, trKey) {
//   const tr = translation[langKey]
//   const type = getType(trKey)
//   return tr[type][trKey]
// }

export default function(trKey) {
  const type = getType(trKey)
  return {
    en: translation.en[type].trKey,
    pt: translation.pt[type].trKey
  }
}
