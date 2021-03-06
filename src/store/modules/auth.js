import Vue from 'vue'

export default {
  state: {
    authStatus: localStorage.getItem('auth') || '',
    user: ''
  },
  mutations: {
    login_success (state, data) {
      console.log(data)
      localStorage.setItem('auth', data.csrf_token)
      Vue.prototype.$http.defaults.headers.common.Authorization = data.csrf_token
      state.authStatus = true
      state.user = data.user
    },
    update_success (state, user) {
      state.user = user
    },
    logout_success (state) {
      localStorage.removeItem('auth')
      delete Vue.prototype.$http.defaults.headers.common.Authorization
      state.authStatus = ''
      state.user = ''
    }
  },
  actions: {
    login ({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post('/auth/login', { data: credentials })
          .then(resp => {
            commit('login_success', resp.data.data)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    register ({ commit, dispatch }, user) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post('/auth/register', { data: user })
          .then(resp => {
            dispatch('login', user)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    update ({ commit, dispatch }, user) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .put(`/users/${user.id}/update`, { data: user })
          .then(resp => {
            commit('update_success', user)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    delete ({ commit, dispatch }, id) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
        .delete(`users/${id}/delete`)
          .then(resp => {
            commit('logout_success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post('/auth/logout')
          .then(resp => {
            commit('logout_success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.authStatus,
    stateUser: state => state.user
  }
}
