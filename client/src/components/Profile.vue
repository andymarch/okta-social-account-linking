<template>
<div class="content">
    <div class="section">
        Hi {{user.displayname}}, your account id is {{user.sub}}
    </div>

    <div class="section">
        <h3>Social Accounts</h3>
        <div>Facebook</div>
        <div v-if="user.facebook_email !== ''">
            <form @submit.prevent="unlinkFacebook">
                <button type="submit">Unlink</button>
            </form>
        </div>
        <div v-else>
            <form @submit.prevent="linkFacebook">
                <label for="facebookemail">Facebook Email Address</label>
                <input id="facebookemail" v-model="link_facebook"/>
                <button type="submit">Save</button>
            </form>
        </div>
        <div class="section" v-if="facebook.loggedin === 'yes'">
            You are {{facebook.name}},logged into facebook with
            {{facebook.email}} with id {{facebook.id}}
        </div>
        <div class="section" v-if="facebook.loggedin === 'no'">
            You are {{facebook.name}},logged into facebook with
            {{facebook.email}} with id {{facebook.id}}
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
                    name: '',
                    id: '',
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

            linkFacebook: async function(){
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
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    this.facebook.loggedin = 'yes'
                    var url = '/me?fields=id,name,email';
                    FB.api(url, function(response) {
                        this.facebook.name = response.name
                        this.facebook.id = response.id
                        this.facebook.email = response.email
                    }, {scope: 'email'});
                }
                else if (response.status === 'not_authorized') {
                    this.facebook.loggedin = 'yes'
                    this.facebook.name = "not authorized"
                } else {
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