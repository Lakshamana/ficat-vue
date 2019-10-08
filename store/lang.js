export const state = () => ({
  langTag: 'pt'
})

export const mutations = {
  setLangTag(state, langTag) {
    state.langTag = langTag
  }
}

export const actions = {
  change({ commit }, langTag) {
    commit('setLangTag', langTag)
  }
}
