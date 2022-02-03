<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost"/>
    </section>
  </div>
</template>

<script>
import AdminPostForm from "@/components/Admin/AdminPostForm"
export default {
  components:{
    AdminPostForm
  },
  data(){
    return{
      loadedPost:{
        author:'Kimihito',
        title:'My awesome post hoge!',
        content:'Super amaizing, thanks for that!',
        thumbnailLink:'hoge'
      }
    }
  }
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