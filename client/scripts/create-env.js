const fs = require('fs')
fs.writeFileSync('../.env',
'VUE_APP_ISSUER=${process.env.VUE_APP_ISSUER}\n'+
'VUE_APP_CLIENT_ID=${process.env.VUE_APP_CLIENT_ID}\n'+
'VUE_APP_REDIRECT=${process.env.VUE_APP_REDIRECT}\n'+
'VUE_APP_SCOPE=${process.env.VUE_APP_SCOPE}\n'+
'VUE_APP_API_BASE_URI=${process.env.VUE_APP_API_BASE_URI}\n'+
'VUE_APP_LOGIN_IDP_ID=${process.env.VUE_APP_LOGIN_IDP_ID}\n'+
'VUE_APP_MATCHING_IDP_ID=${process.env.VUE_APP_MATCHING_IDP_ID}\n'+
'VUE_APP_FACEBOOK_APP_ID=${process.env.VUE_APP_FACEBOOK_APP_ID}')