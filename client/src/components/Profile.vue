<template>
<div class="content">
    <div class="section">
        Hi {{user.displayname}}, your account id is {{user.sub}}
    </div>

    <div class="section">
        <h3>Facebook</h3>
        <div v-if="user.facebook_email !== ''">
            <form @submit.prevent="unlinkFacebook">
                <button type="submit">Unlink</button>
            </form>
        </div>
        <div v-else>
            <!-- User is logged in and has authorized the app -->
            <div class="section" v-if="facebook.loggedin === 'yes' &&
            facebook.authorized === 'yes'">
                <div>You are {{facebook.name}} on facebook with {{facebook.email}}.</div>
                <form @submit.prevent="linkFacebookVerified">
                    <button type="submit">Link this account</button>
                </form>
            </div>
            <div v-else class="section" >
                <div v-if="facebook.loggedin === 'yes' &&
                facebook.authorized === 'no'">
                    You are logged into Facebook but you have not authorized the application.
                </div>
                <div class="section" v-if="facebook.loggedin === 'no'">
                    You are not logged into facebook.
                </div>
                <div>Enter your facebook email address and we will redirect you
                to authenticate and authorize this application.</div>
                <form @submit.prevent="linkFacebookWithRedirect">
                    <label for="facebookemail">Facebook Email Address</label>
                    <input id="facebookemail" v-model="link_facebook"/>
                    <button type="submit">Link this account</button>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<script>
    const axios = require('axios');
    export default {
        name: 'dashboard',
        data(){
            return {
                user: {
                    sub: '',
                    displayname: '',
                    email: '',
                    facebook_email: ''
                },
                link_facebook: '',
                facebook:{
                    loggedin:'',
                    authorized: '',
                    name: '',
                    email: ''
                }
                
            }
        },
        methods: {
            getUser: async function() {
                var user = await this.$auth.getUser();
                this.user.sub = user.sub
                this.user.displayname = user.name
                this.user.email = user.preferred_username
                var tokenValue = await this.$auth.getAccessToken();
                axios.defaults.headers.common['Authorization'] = `Bearer `+tokenValue
                try {
                    const response = await axios.get(process.env.VUE_APP_API_BASE_URI+'/account/'+user.sub)
                    if(response.data.profile.social_facebook_email){
                        this.user.facebook_email = response.data.profile.social_facebook_email
                    }
                }
                catch(error) {
                    console.log(error);
                }
            },

            linkFacebookVerified: async function(){
                var user = await this.$auth.getUser();
                var tokenValue = await this.$auth.getAccessToken();
                axios.defaults.headers.common['Authorization'] = `Bearer `+tokenValue
                try {
                    const response = await axios.post(process.env.VUE_APP_API_BASE_URI+'/account/'+user.sub+'/facebook',
                    {
                        facebook_email: this.facebook.email
                    })
                    this.$router.go('/')
                }
                catch(error) {
                    console.log(error);
                }
            },

            linkFacebookWithRedirect: async function(){
                var user = await this.$auth.getUser();
                var tokenValue = await this.$auth.getAccessToken();
                axios.defaults.headers.common['Authorization'] = `Bearer `+tokenValue
                try {
                    const response = await axios.post(process.env.VUE_APP_API_BASE_URI+'/account/'+user.sub+'/facebook',
                    {
                        facebook_email: this.link_facebook
                    })
                    
                    await this.$auth.logout()
                    var config = {
                        idp: process.env.VUE_APP_MATCHING_IDP_ID
                    };
                    this.$auth.loginRedirect('/',config)
                }
                catch(error) {
                    console.log(error);
                }
            },

            unlinkFacebook: async function(){
                var user = await this.$auth.getUser();
                var tokenValue = await this.$auth.getAccessToken();
                axios.defaults.headers.common['Authorization'] = `Bearer `+tokenValue
                try {
                    const response = await axios.delete(process.env.VUE_APP_API_BASE_URI+'/account/'+user.sub+'/facebook')
                    this.$router.go('/')
                }
                catch(error) {
                    console.log(error);
                }
            },

            checkLoginState() {
            FB.init({
              appId            : '385592178954663',
              autoLogAppEvents : true,
              xfbml            : true,
              version          : 'v3.3'
            });
            var url = '/me?fields=name,email';
            FB.getLoginStatus((response) => {
                if (response.status === 'connected') {
                    this.facebook.loggedin = 'yes'
                    this.facebook.authorized = 'yes'
                    var url = '/me?fields=name,email';
                    FB.api(url, (response) => {
                        this.facebook.name = response.name
                        this.facebook.email = response.email
                    }, {scope: 'email'});
                }
                else if (response.status === 'not_authorized') {
                    console.log("user logged in but not_authorized")
                    this.facebook.loggedin = 'yes'
                    this.facebook.authorized = 'no'
                } else {
                    console.log("not logged in")
                    this.facebook.loggedin = 'no'
                }
            });
            }
        },
        created: function(){
            this.getUser()
            this.checkLoginState()
        }
    }
</script>
<style>
</style>