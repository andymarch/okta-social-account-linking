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
  issuer: 'https://social.oktapreview.com/oauth2/default',
  client_id: '0oaksvclf9axrV2vV0h7',
  redirect_uri: 'http://localhost:8080/implicit/callback',
  scope: 'openid profile email'
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
