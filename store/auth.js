import { recovery, persist } from '@/front/persistence'

export const state = () => ({
  user: recovery('user'),
  xsrfToken: recovery('xsrfToken')
})

export const mutations = {
  setUser(state, username) {
    persist('user', username)
    state.username = username
  },

  setXsrfToken(state, xsrfToken) {
    persist('xsrfToken', xsrfToken)
    state.xsrfToken = xsrfToken
  }
}

export const actions = {
  login({ commit }, username) {
    console.log('set username:', username)
    commit('setUser', username)
  },

  logout({ commit }, username) {
    commit('setUser', undefined)
  }
}
