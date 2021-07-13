<template>
    <div class="content">
        <div id="widget-container"></div>
    </div>
</template>
<script>
    import OktaSignIn from '@okta/okta-signin-widget'
    import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css'
    export default {
    name: 'Login',
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
            idps: [
                {type: 'FACEBOOK', id: process.env.VUE_APP_FACEBOOK_LOGIN_IDP_ID},
                {type: 'GOOGLE', id: process.env.VUE_APP_GOOGLE_LOGIN_IDP_ID}
            ],
            authParams: {
                pkce: true,
                issuer: process.env.VUE_APP_ISSUER,
                scopes: process.env.VUE_APP_SCOPE.split(' ')
            }
        })
        this.widget.renderEl(
            { el: '#widget-container' },
            function success(){
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