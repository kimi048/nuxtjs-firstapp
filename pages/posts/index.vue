<template>
  <div class="posts-page">
    <PostList :posts="loadedPosts"/>
  </div>
</template>

<script>
import PostList from "@/components/Posts/PostList";
export default{
  components:{
    PostList
  }, 
  data(){
    return{
      loadedPosts:[]
    }
  },
  created() {
    setTimeout(() => {
      this.loadedPosts = [
        {
          id: '1',
          title: 'First Post',
          previewText: 'This is our first Post!',
          thumbnail: '/web.jpg',
        },
        {
          id: '2',
          title: 'Second Post',
          previewText: 'This is our second Post!',
          thumbnail: '/web.jpg',
        },
      ]
    }, 1500)
  },
}
</script>

<style>
.posts-page {
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>
