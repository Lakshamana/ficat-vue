// import { persist, recovery } from '@/front/persistence'

export const state = () => ({
  langTag: ''
})

export const mutations = {
  setLangTag(state, langTag) {
    // persist('langTag', { langTag })
    state.langTag = langTag
  }
}

export const actions = {
  change({ commit }, langTag) {
    commit('setLangTag', langTag)
  }
}
