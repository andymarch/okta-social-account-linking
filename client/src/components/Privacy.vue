<template>
<div class="content">
    <div class="section">
        <h3>Privacy</h3>
        <p>
            This service is a demonstration of Okta social account linking only and should be used as such.
            All data is held in a US tenanted Okta instance.
            Data will be secured to the best of our ability however it is not recommended to place any sensitive values on user profiles.
        </p>

        <p>Accounts can be removed through the <router-link to="/delete">self deletion service</router-link>.</p>

        <p>For any further information or concerns please contact andy.march@okta.com</p>
    </div>
</div>
</template>
<script>
    export default {
    name: 'privacy',
    data(){
        return {
        }
    },
}
</script>
<style>
</style>