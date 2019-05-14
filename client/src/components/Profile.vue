<template>
<div>
    <div>
        Hi {{user.displayname}}, your account id is {{user.sub}}
    </div>

    <div>
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
                link_facebook: ''
                
            }
        },
        methods: {
            getUser: async function() {
                var user = await this.$auth.getUser();
                this.user.sub = user.sub
                this.user.displayname = user.name
                this.user.email = user.preferred_username
                var tokenValue = await this.$auth.getAccessToken();

                try {
                const response = await axios.get(process.env.VUE_APP_API_BASE_URI+'/account/'+user.sub,
                    { headers:{
                    "Authorization": 'Bearer '+tokenValue}
                    })
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
                    this.$router.go()
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
                    this.$router.go()
                }
                catch(error) {
                    console.log(error);
                }
            }
        },
        created: function(){
            this.getUser();
        }
    }
</script>
<style>
</style>