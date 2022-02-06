<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import AdminPostForm from '@/components/Admin/AdminPostForm'
export default {
  layout: 'admin',
  components: {
    AdminPostForm,
  },
  asyncData(context) {
    return context.$axios
      .$get(
        'https://nuxt-first-kimi-default-rtdb.firebaseio.com/posts/' +
          context.params.postId +
          '.json'
      )
      .then((res) => {
        console.log(res)
        return {
          loadedPost: { ...res, id: context.params.postId },
        }
      })
      .catch((e) => context.error(e))
  },
  methods: {
    onSubmitted(editedPost) {
      this.$axios
        .$put(
          'https://nuxt-first-kimi-default-rtdb.firebaseio.com/posts/' +
            this.$route.params.postId +
            '.json',
          editedPost
        )
        .then((res) => {
          console.log(res)
          this.$router.push('/admin')
        })
        .catch((e) => console.log(e))
    },
  },
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
