<template>
<div class="content">
    <div class="section">
        <p>
            This user has attempted to login with a federated account which was not
        matched to an existing account.
        </p>
    </div>

    <div class="section">
        <h3>Existing Account</h3>
        <p>This will allow a user to login with existing credentials and then link their federated account.</p>
        <div id="widget-container"></div>
    </div>
</div>
</template>
<script>
    import OktaSignIn from '@okta/okta-signin-widget'
    import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css'
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
    mounted: function () {
        this.$nextTick(function () {
        this.widget = new OktaSignIn({
            baseUrl: process.env.VUE_APP_ISSUER.split('/oauth2')[0],
            clientId: process.env.VUE_APP_CLIENT_ID,
            redirectUri: process.env.VUE_APP_REDIRECT,
            i18n: {
                en: {
                    'primaryauth.title': 'Sign in'
                }
            },
            colors: {
                brand: '#e22866'
            },
            features: {
                registration: true,                 // Enable self-service registration flow
                rememberMe: true,                   // Setting to false will remove the checkbox to save username
                multiOptionalFactorEnroll: true,  // Allow users to enroll in multiple optional factors before finishing the authentication flow.
            },
            authParams: {
                pkce: true,
                issuer: process.env.VUE_APP_ISSUER,
                display: 'page',
                scopes: process.env.VUE_APP_SCOPE.split(' ')
            }
        })
        this.widget.renderEl(
            { el: '#widget-container' },
            function success(res){
            /**
             * In this flow, the success handler will not be called because we redirect
             * to the Okta org for the authentication workflow.
             */
            },
        )       
        })
    },
    destroyed () {
        // Remove the widget from the DOM on path change
        this.widget.remove()
    }
}
</script>
<style>
</style>