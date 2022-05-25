<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="author.image" class="user-img" />
            <h4>{{ author.username }}</h4>
            <p>
              Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda
              looks like Peeta from the Hunger Games
            </p>
            <button @click="settingOrFollow" class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp; {{ self ? 'Edit Profile Settings' : author.following ?`Unfollow ${author.username}` : `Follow ${author.username}` }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a :class="{'nav-link':true, 'active': !favorited }" @click="getArticlesByParams(false)" href="javascript:;">My Articles</a>
              </li>
              <li class="nav-item">
                <a :class="{'nav-link':true, 'active': favorited }" @click="getArticlesByParams(true)" href="javascript:;">Favorited Articles</a>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article,index in articles" :key="index">
            <div class="article-meta">
              <a href=""><img :src="article.author.image" /></a>
              <div class="info">
                <a href="" class="author">{{ article.author.username }}</a>
                <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <a href="" class="preview-link">
              <h1>
                {{ article.title }}
              </h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list" v-if="article.tagList.length">
                <li class="tag-default tag-pill tag-outline" v-for="tag in article.tagList" :key="tag">{{ tag }}</li>
              </ul>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile,followUser,unFollowUser } from "@/api/user.js";
import { getArticles } from "@/api/article.js";
export default {
  middleware: "authenticated",
  name:'Profile',
  data(){
    return {
      author:{},
      articles:[],
      articlesCount:0,
      favorited:false,
      self:false
    }
  },
  async mounted(){
    if(this.author.username === this.$store.state.user.username){
      this.self = true
    }
    await this.getUserProfile()
    await this.getArticlesByParams()
  },
  methods:{
    async getUserProfile(){
      const { username } = this.$route.params
      const {data:{ profile }} = await getProfile(username)
      this.author = profile
      console.log(this.author);
    },
    async getArticlesByParams(favorited){
      const { username } = this.$route.params
      const option = { }
      if(favorited) {
          option.favorited = username
          this.favorited = true
      }else{
        option.author = username 
        this.favorited = false
      }
      const { data:{ articles,articlesCount } } = await getArticles(option)
      this.articles = articles
      this.articlesCount = articlesCount
    },
    async settingOrFollow(){
      if(this.author.username === this.$store.state.user.username){
        this.$router.push({
          name:'settings'
        })
      }else{
        if (this.author.following) {
          // 取消关注
          await unFollowUser(this.author.username)
        } else {
          // 添加关注
          await followUser(this.author.username)
        }
        await this.getUserProfile()
      }
    }
  }
};
</script>

<style>
</style>