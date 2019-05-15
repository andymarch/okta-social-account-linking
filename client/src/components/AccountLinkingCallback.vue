<script>
export default {
  name: 'AccountLinkingCallback',
  async beforeMount () {
    try {
        await this.$auth.handleAuthentication()
        this.$router.replace({
        path: this.$auth.getFromUri()
        })
    } catch (err){
        if(err.errorSummary =="User creation was disabled."){
            this.$router.replace({path: '/accountLinking'})
        } else{
            throw err
        }
    }
  },
  render () {}
}
</script>