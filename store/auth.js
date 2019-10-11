import { recovery, persist } from '@/front/persistence'

export const state = () => ({
  user: recovery('user'),
  xsrfToken: recovery('xsrfToken')
})

export const mutations = {
  setUser(state, username) {
    persist('user', username, {
      domain: process.env.HOST,
      path: '/'
    })
    state.user = username
  },

  setXsrfToken(state, xsrfToken) {
    state.xsrfToken = xsrfToken
  }
}

export const actions = {
  login({ commit }, { username, xsrfToken }) {
    commit('setUser', username)
    commit('setXsrfToken', xsrfToken)
  },

  logout({ commit }) {
    commit('setUser', false)
    commit('setXsrfToken', false)
  }
}
