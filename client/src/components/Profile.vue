<template>
<div class="content">
    <div class="section">
        Hi {{user.displayname}}, your Okta account id is {{user.sub}}.
    </div>

    <div class="section">
        <h3>Facebook</h3>
        <div class="section" v-if="user.facebook_email !== ''">
            <div>You can login from Facebook with email {{user.facebook_email}}</div>
            <form @submit.prevent="unlinkFacebook">
                <button type="submit">Unlink this account</button>
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
                <div v-if="facebook.sdk_loaded === false">
                    Facebook SDK blocked, unable to determine user or status.
                </div>
                <div v-else-if="facebook.loggedin === 'yes' &&
                facebook.authorized === 'no'">
                    You are logged into Facebook but you have not authorized the application.
                </div>
                <div class="section" v-else-if="facebook.loggedin === 'no'">
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
    <div class="section">
        <h3>Google</h3>
        <div class="section" v-if="user.google_email !== ''">
            <div>You can login from Google with email {{user.google_email}}</div>
            <form @submit.prevent="unlinkGoogle">
                <button type="submit">Unlink this account</button>
            </form>
        </div>
        <div v-else>
            <div class="section" >
                <div>Enter your google account email address and we will redirect you
                to authenticate and authorize this application.</div>
                <form @submit.prevent="linkGoogleWithRedirect">
                    <label for="googleemail">Google Email Address</label>
                    <input id="googleemail" v-model="link_google"/>
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
                    facebook_email: '',
                    google_email: ''
                },
                link_facebook: '',
                link_google: '',
                facebook:{
                    sdk_loaded: '',
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
                    else{
                        this.user.facebook_email = ''
                    }
                    if(response.data.profile.social_google_email){
                        this.user.google_email = response.data.profile.social_google_email
                    } 
                    else {
                        this.user.google_email = ''
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
                    this.$router.go()
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
                        idp: process.env.VUE_APP_FACEBOOK_MATCHING_IDP_ID
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
                    this.getUser()
                }
                catch(error) {
                    console.log(error);
                }
            },

            checkLoginState() {
            FB.init({
              appId            : process.env.VUE_APP_FACEBOOK_APP_ID,
              autoLogAppEvents : true,
              xfbml            : true,
              version          : 'v3.3'
            });
            this.facebook.sdk_loaded = true
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
                    this.facebook.loggedin = 'yes'
                    this.facebook.authorized = 'no'
                } else {
                    this.facebook.loggedin = 'no'
                }
            });
            },

            linkGoogleWithRedirect: async function(){
                var user = await this.$auth.getUser();
                var tokenValue = await this.$auth.getAccessToken();
                axios.defaults.headers.common['Authorization'] = `Bearer `+tokenValue
                try {
                    const response = await axios.post(process.env.VUE_APP_API_BASE_URI+'/account/'+user.sub+'/google',
                    {
                        google_email: this.link_google
                    })
                    
                    await this.$auth.logout()
                    var config = {
                        idp: process.env.VUE_APP_GOOGLE_MATCHING_IDP_ID
                    };
                    this.$auth.loginRedirect('/',config)
                }
                catch(error) {
                    console.log(error);
                }
            },

            unlinkGoogle: async function(){
                var user = await this.$auth.getUser();
                var tokenValue = await this.$auth.getAccessToken();
                axios.defaults.headers.common['Authorization'] = `Bearer `+tokenValue
                try {
                    const response = await axios.post(process.env.VUE_APP_ISSUER+'/api/v1/users/me',{
                        profile:{social_google_email: null}
                    })
                    this.getUser()
                }
                catch(error) {
                    console.log(error);
                }
            },
        },
        created: function(){
            this.getUser()
            try {
                this.checkLoginState()
            } catch (error){
                this.facebook.sdk_loaded = false
            }
        }
    }
</script>
<style>
</style>