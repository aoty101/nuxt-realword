<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          v-model="body.body"
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
        ></textarea>
      </div>
      <div class="card-footer">
        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
        <button @click="postComment" type="button" class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">
          {{ comment.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="{ name:'profile',params:{ username:comment.author.username }  }" class="comment-author">
          <img
            :src="comment.author.image"
            class="comment-author-img"
          />
        </nuxt-link>
        &nbsp;
        <nuxt-link :to="{
          name:'profile',
          params:{
            username:comment.author.username
          }
        }" class="comment-author">{{ comment.author.username }}</nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
        <span class="mod-options" v-if="comment.author.username === $store.state.user.username" >
          <a @click="deleteComment(comment.id)" href="javascript:;">delete</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments,createComment,deleteComment } from "@/api/article.js";
export default {
  name: "ArticleComments",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      body:{
        body:''
      }
    };
  },
  async mounted() {
    await this.initComments()
  },
  methods:{
    async initComments(){
      const { data } = await getComments(this.article.slug);
      this.comments = data.comments;
    },
    async postComment(){
      await createComment(this.article.slug,{
        comment: this.body
      })
      this.body.body = ''
      await this.initComments()
    },
    async deleteComment(id){
      console.log(id);
      await deleteComment(this.article.slug,id)
      await this.initComments()
    }
  }
};
</script>

<style>
</style>