<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>
    <button
      class="btn btn-sm btn-outline-secondary"
      :class="{ active: article.author.following }"
      @click="editOrFollow"
    >
      <i class="ion-plus-round"></i>
      &nbsp;{{ self ? 'Edit Article' : article.author.following ? `Unfollow ${article.author.username}` : `Follow ${article.author.username}` }}
    </button>
    &nbsp;&nbsp;
    <button
      :class="{
         btn:true, 
        'btn-sm':true,
        'btn-outline-primary':!self,
        'btn-outline-danger':self,
        active: article.favorited,
      }"
      @click="deleteOrFavorite"
    >
      <i class="ion-heart"></i>
      &nbsp;{{ self ? 'Delete Article': article.favorited ? 'Unfavorite Article' : 'Favorite Article' }}<span v-if="!self" class="counter">{{ `(${ article.favoritesCount })` }}</span>
    </button>
  </div>
</template>

<script>
import { deleteArticle,addFavorite,deleteFavorite } from '@/api/article.js'
import { followUser,unFollowUser } from "@/api/user.js";
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data(){
    return{
      self:false
    }
  },
  mounted(){
    if( this.article.author.username === this.$store.state.user.username ){
      this.self = true
    }
  },
  head(){
    return{
        title: `${this.article.title} - RealWorld`,
        meta:[
            { hid: 'description', name:'description',content: this.article.description }
        ]
    }
  },
  methods:{
    async deleteOrFavorite(){
      if(this.self){
       await deleteArticle(this.article.slug)
       this.$router.push({
         name:'home'
       })
      }else{
        this.article.favoriteDisabled = true
        if (this.article.favorited) {
          // 取消点赞
          await deleteFavorite(this.article.slug)
          this.article.favorited = false
          this.article.favoritesCount += -1
        } else {
          // 添加点赞
          await addFavorite(this.article.slug)
          this.article.favorited = true
          this.article.favoritesCount += 1
        }
        this.article.favoriteDisabled = false
      }
    },
    async editOrFollow(){
      if(this.self){
        this.$router.push({
          name:'editor',
          params:{
            article:{
              title: this.article.title,
              description: this.article.description,
              body: this.article.body.toString().replace(/<[^>]+>/g, ""),
              tagList: this.article.tagList
            }
          }
        })
      }else{
        const author = this.article.author
        this.article.followed = true
        if (author.following) {
          // 取消关注
          await unFollowUser(author.username)
          this.article.author.following = false
        } else {
          // 添加关注
          await followUser(author.username)
          this.article.author.following = true
        }
        this.article.followed = false
      }
    }
  }
};
</script>

<style>
</style>