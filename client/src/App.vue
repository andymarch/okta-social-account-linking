<template>
  <div id="app">
    <div id="DemoHeader">
      <img id="DemoLogo" :src="require('@/assets/dev_logo.png')" alt="Okta">
      <h1 id="DemoName">Social Account Linking</h1>
    </div>
    <router-view></router-view>
    <div class="section">
        <button v-if='authenticated' v-on:click='logout' id='logout-button'>Logout</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: function () {
      return {
        authenticated: false
      }
    },
    created () {
      this.isAuthenticated()
    },
    watch: {
      // Everytime the route changes, check for auth status
      '$route': 'isAuthenticated'
    },
    methods: {
      async isAuthenticated () {
        this.authenticated = await this.$auth.isAuthenticated()
      },
      async logout () {
        await this.$auth.logout()
        await this.isAuthenticated()

        // Navigate back to home
        this.$router.go({ path: '/' })
      }
    }
  }
</script>

<style>
</style>
