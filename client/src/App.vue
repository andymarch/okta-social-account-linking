<template>
  <div id="app">
        <button v-if='authenticated' v-on:click='logout' id='logout-button'>Logout</button>
    <h1>Okta Social Demo</h1>
    <router-view></router-view>
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
