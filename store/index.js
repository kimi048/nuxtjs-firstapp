import Vuex from 'vuex'
import Cookie from 'js-cookie'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null,
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          (post) => post.id === editedPost.id
        )
        state.loadedPosts[postIndex] = editedPost
      },
      setToken(state, token) {
        state.token = token
        // console.log("statetoken")
        // console.log(state.token)
        // console.log("statetoken end")
      },
      clearToken(state) {
        state.token = null
      },
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return this.$axios
          .$get(
            'https://nuxt-first-kimi-default-rtdb.firebaseio.com/posts.json'
          )
          .then((res) => {
            console.log(res)
            const postArray = []
            for (const key in res) {
              postArray.push({ ...res[key], id: key })
            }
            vuexContext.commit('setPosts', postArray)
            console.log('postArray commited')
            console.log(postArray)
          })
          .catch((e) => context.error(e))
      },
      addPost({ commit, state }, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date(),
        }
        return this.$axios
          .$post(
            'https://nuxt-first-kimi-default-rtdb.firebaseio.com/posts.json?auth=' +
              state.token,
            createdPost
          )
          .then((result) => {
            console.log('result:')
            console.log(result)
            commit('addPost', { ...createdPost, id: result.name })
          })
          .catch((e) => console.log(e))
      },
      editPost({ state, commit }, editedPost) {
        return this.$axios
          .$put(
            'https://nuxt-first-kimi-default-rtdb.firebaseio.com/posts/' +
              editedPost.id +
              '.json?auth=' +
              state.token,
            editedPost
          )
          .then((res) => {
            console.log(res)
            commit('editPost', editedPost)
          })
          .catch((e) => console.log(e))
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
      },
      authenticateUser({ commit }, authData) {
        let authUrl =
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          process.env.fbAPIKey
        if (!authData.isLogin) {
          authUrl =
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
            process.env.fbAPIKey
        }
        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
          })
          .then((result) => {
            console.log(result)
            commit('setToken', result.idToken)
            localStorage.setItem('token', result.idToken)
            localStorage.setItem(
              'tokenExpiration',
              new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
            )
            Cookie.set('jwt', result.idToken)
            Cookie.set(
              'expirationDate',
              new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
            )
            console.log(result.idToken)
          })
          .catch((e) => console.log(e))
      },
      initAuth({ commit }, req) {
        let token
        let expirationDate
        if (req) {
          if (!req.headers.cookie) {
            return
          }
          const jwtCookie = req.headers.cookie
            .split(';')
            .find((c) => c.trim().startsWith('jwt='))
          if (!jwtCookie) {
            return
          }
          token = jwtCookie.split('=')[1]
          expirationDate = req.headers.cookie
            .split(';')
            .find((c) => c.trim().startsWith('expirationDate='))
            .split('=')[1]
        } else {
          token = localStorage.getItem('token')
          expirationDate = localStorage.getItem('tokenExpiration')
        }
        if (new Date().getTime() > +expirationDate || !token) {
          console.log('No token or invalid token')
          commit('clearToken')
          return
        }
        commit('setToken', token)
      },
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      },
      isAuthenticated(state) {
        return state.token != null
      },
    },
  })
}

export default createStore
