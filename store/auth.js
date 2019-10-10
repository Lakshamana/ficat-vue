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
  }
}

export const actions = {
  login({ commit }, username) {
    console.log(username)
    commit('setUser', username)
  },

  logout({ commit }) {
    commit('setUser', false)
    commit('setXsrfToken', false)
  }
}
