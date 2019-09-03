export const state = () => ({
  langTag: 'pt'
})

export const mutations = {
  setLangTag(state, langTag) {
    state.langTag = langTag
  }
}
