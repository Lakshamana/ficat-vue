import en from '@/front/i18n/en'
import pt from '@/front/i18n/pt'

const translations = {
  en,
  pt
}

const DEFAULT_TR = '_Translation Not Found_'
// const DEFAULT_ARG = '_i18n argument not found_'

export default ({ store }, inject) => {
  // key = String that fits the form 'string.string'
  // args = Array of arguments (used if trKey is a actually a function)
  inject('tr', (key, args) => {
    const lang = store.state.lang.lang || 'pt'
    const [subject, trKey] = key.split('.')

    // trResult could be a function as well as a string
    const translation = translations[lang][subject][trKey]

    // Maps arguments translations
    // i.e., arguments can be i18n keys or the values itself
    // arguments and whole translation should be below the same subject
    const mapArgs =
      args &&
      args.map(arg => {
        // Allows using objects as differents language forms for same phrases
        const useKey = typeof arg === 'object' ? arg[lang] : arg
        return translations[lang][subject][useKey] || useKey
      })

    // Return fn evaluation of the value itself (if it's a string)
    return (
      (typeof translation === 'function'
        ? translation(...mapArgs)
        : translation) || DEFAULT_TR
    )
  })
}
