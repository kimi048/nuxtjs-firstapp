import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      },
    },
    actions: {
      nuxtServerInit(vuexContext,context){
        return this.$axios.$get('https://nuxt-first-kimi-default-rtdb.firebaseio.com/posts.json')
        .then(res=>{
          console.log(res);
          const postArray=[];
          for (const key in res){
            postArray.push({...res[key],id:key})
          }
          vuexContext.commit("setPosts",postArray)
          console.log("postArray commited");
          console.log(postArray);
        })
        .catch(e=>context.error(e))
      },
      setPosts(vuexContext,posts){
        vuexContext.commit("setPosts",posts)
      }
    },
    getters: {
      loadedPosts(state){
        return state.loadedPosts
      }
    },
  })
}

export default createStore;