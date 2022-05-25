<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link v-if="isLogin" to="/register">
              Need an account ?
            </nuxt-link>
            <nuxt-link v-else to="/login"> Have an account? </nuxt-link>
          </p>

          <ul class="error-messages">
            <li v-for="(messages, field) in errors" :key="field">
              {{ field }} {{ messages }}
            </li>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group">
              <input
                v-if="!isLogin"
                class="form-control form-control-lg"
                v-model="user.username"
                required
                type="text"
                placeholder="Your Name"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.email"
                type="email"
                required
                placeholder="Email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.password"
                type="password"
                required
                minlength="8"
                placeholder="Password"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from "@/api/user.js";
const Cookie = process.client ? require("js-cookie") : undefined; // process。client 为nuxt内置判断是否在客户端中
export default {
  middleware: "notAuthenticated",
  name: "LoginIndex",
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },
  data() {
    return {
      // 1258157385@qq.com    12345678
      user: {
        username: "",
        email: "1258157385@qq.com",
        password: "12345678",
      },
      errors: {},
    };
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = this.isLogin
          ? await login({
              user: this.user,
            })
          : await register({
              user: this.user,
            });
            console.log(data.user);
        // 存储数据至容器
        this.$store.commit("setUser", data.user);
        Cookie.set("user", JSON.stringify(data.user));
        console.log(data.user);

        this.$router.push("/");
      } catch (err) {
        this.errors = err.response.data.errors;
      }
    },
  },
};
</script>

<style>
</style>