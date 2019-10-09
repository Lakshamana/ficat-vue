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
    persist('xsrfToken', xsrfToken, {
      domain: process.env.HOST,
      path: '/'
    })
    state.xsrfToken = xsrfToken
  }
}

export const actions = {
  login({ commit }, username) {
    commit('setUser', username)
  },

  logout({ commit }, username) {
    commit('setUser', false)
  }
}
