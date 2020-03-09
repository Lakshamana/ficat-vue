import en from '@/front/i18n/en'
import pt from '@/front/i18n/pt'

const translations = {
  en,
  pt
}

const DEFAULT_TR = '_Translation Not Found_'

export default ({ store }, inject) => {
  // key = String that fits the form 'string.string'
  // args = Array of arguments (used if trKey is a actually a function)
  inject('tr', (key, args) => {
    const lang = store.state.lang.lang || 'pt'
    const [subject, trKey] = key.split('.')

    // trResult could be a function as well as a string
    const translation = translations[lang][subject][trKey]

    // Return fn evaluation of the value itself (if it's a string)
    return (
      (typeof translation === 'function'
        ? translation(...args)
        : translation) || DEFAULT_TR
    )
  })
}
