import Vue from 'vue'

export default {
  state: {
    error: null,
    posts: null
  },
  mutations: {
    setPosts(state, posts) {
        state.posts = posts;
    },
    setError(state, error) {
        state.error = error;
    },
  },
  actions: {
    GetPosts({ commit }, searchParams) {
      let get = `?order=${searchParams.order}&search=${searchParams.search}&year=${searchParams.year}&cat=`;
      if(searchParams.category) {
        searchParams.category.forEach(cat => {
          get += cat + ','
        });
      }
      return new Promise((resolve, reject) => {
          Vue.prototype.$http
              .get(`posts${get}`)
              .then(resp => {
                commit('setPosts', resp.data.data)
                resolve(resp)
              })
              .catch(err => {
                commit('setError', err)
                reject(err)
              })
        })
    },
    GetSinglePost({ commit }, slug) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$http
              .get(`posts/${slug}`)
              .then(resp => {
                commit('setPosts', resp.data.data)
                resolve(resp)
              })
              .catch(err => {
                commit('setError', err)
                reject(err)
              })
        })
    },
    DeletePost({ commit }, id) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$http
              .delete(`posts/${id}/delete`)
              .then(resp => {
                resolve(resp)
              })
              .catch(err => {
                commit('setError', err)
                reject(err)
              })
        })
    },
    UpdatePost({ commit }, post) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$http
              .put(`posts/${post.id}/update`, {data: post})
              .then(resp => {
                resolve(resp)
              })
              .catch(err => {
                commit('setError', err)
                reject(err)
              })
        })
    },
    InsertPost({ commit }, post) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$http
              .post(`posts`, {data: post})
              .then(resp => {
                resolve(resp)
              })
              .catch(err => {
                commit('setError', err)
                reject(err)
              })
        })
    },
    ExportPosts({ commit }) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$http
              .post(`posts/generate`)
              .then(resp => {
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
        })
    },
  },
  getters: {
    StateError: (state) => state.error,
    StatePosts: (state) => state.posts,
  }
}
