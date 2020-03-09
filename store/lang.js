export const state = () => ({
  lang: 'pt'
})

export const mutations = {
  setLang(state, lang) {
    state.lang = lang
  }
}

export const actions = {
  change({ commit }, lang) {
    commit('setLang', lang)
  }
}
