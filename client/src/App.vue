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
        window.location.href = '/'
      }
    }
  }
</script>

<style>
html{
    background: #20313b;
}

body{
    font-family: 'Roboto', sans-serif;
    color: #d2d2d6;
}

html, body, .viewport {
    width: 100%;
    height: 100%;
    margin: 0;
  }

#app{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

#DemoHeader{
    height: 30px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

#DemoLogo{
    height: auto;
    width: 8%;
}

#DemoName{
    font-size: xx-large;
    color: white;
}

.content{
    margin-top: 50px;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    font-weight: lighter;
}

p {
    text-align: center;
}

.section {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    font-weight: lighter;
}

.section h1,h2,h3,h4 {
    margin: 5px;
    text-align: center;
}

.section p{
    margin:5px;
}

.section li {
    list-style-type: none;
}

label {
    padding-right: 10px;
}

button {
    margin-left: 10px;
    margin-right: 10px;
    margin-top:10px;
    background-color: #e22866;
    color: white;
    border-radius: 3px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
    height: 45px;
    border: 2px solid transparent;
    cursor: pointer;
}

#okta-sign-in{
    margin:auto !important
}
</style>
