import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
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
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date(),
        }
        return this.$axios
          .$post(
            'https://nuxt-first-kimi-default-rtdb.firebaseio.com/posts.json',
            createdPost
          )
          .then((result) => {
            console.log('result:')
            console.log(result)
            vuexContext.commit('addPost', { ...createdPost, id: result.name })
          })
          .catch((e) => console.log(e))
      },
      editPost({ commit }, editedPost) {
        return this.$axios
          .$put(
            'https://nuxt-first-kimi-default-rtdb.firebaseio.com/posts/' +
              editedPost.id +
              '.json',
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
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      },
    },
  })
}

export default createStore
