<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userInfo.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userInfo.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="userInfo.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button type="button" @click="updateInfo" class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateUser } from "@/api/user.js";
import { mapState } from "vuex";
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware: "authenticated",
  name: "settings",
  data(){
    return {
      userInfo:{
        username:'',
        email:'',
        bio:'',
        image:'',
      }
    }
  },
  mounted(){
    if(this.user){
      const { username,email,bio,image } = this.user
      Object.assign(this.userInfo,{
        username,
        email,
        bio,
        image
      }) 
    }
  },
  methods:{
    async updateInfo(){
      this.$router.push({
        name:'profile',
        params:{
         username: this.userInfo.username,
        }
      })
      const { data } = await updateUser({ user:this.userInfo })
      this.$store.commit("setUser", data.user);
      Cookie.set("user", JSON.stringify(data.user));
      console.log(data);
    }
  },
  computed: {
    ...mapState(["user"]),
  }
};
</script>

<style>
</style>