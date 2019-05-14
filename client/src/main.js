import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import Profile from './components/Profile'
import Login from './components/Login'
import Auth from '@okta/okta-vue'

Vue.use(VueResource)
Vue.use(VueRouter)

Vue.config.productionTip = false

Vue.use(Auth, {
  issuer: process.env.VUE_APP_ISSUER,
  client_id: process.env.VUE_APP_CLIENT_ID,
  redirect_uri: process.env.VUE_APP_REDIRECT,
  scope: process.env.VUE_APP_SCOPE.split(' ')
})

const router = new VueRouter(
  {
    mode: 'history',
    base: '/',
    routes: [
      { path: '/', component: Profile, meta: {requiresAuth: true}},
      { path: '/login', component: Login },
      { path: '/implicit/callback', component: Auth.handleCallback() }
    ]
  }
)

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !(await Vue.prototype.$auth.isAuthenticated())) {
    next({ path: '/login' })
  } else {
    next()
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
