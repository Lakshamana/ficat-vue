import makeTranslations from '@/front/i18nFactory'

export default ({ app }, inject) => {
  inject('tr', key => makeTranslations(key))
}
