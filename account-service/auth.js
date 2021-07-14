const axios = require('axios');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (!authorization) throw new Error('You must send an Authorization header')

    const [authType, token] = authorization.trim().split(' ')
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token')

    var introspect = await axios.post(process.env.ISSUER+'/oauth2/v1/introspect',null,
                    {
                      auth: {username: process.env.CLIENT_ID, password: process.env.CLIENT_SECRET },
                      params: {token: token, token_type_hint: 'access_token'}
                    })
    if(!introspect.data.active){
      throw new Error('Token is no longer active.')
    }
    next()
  } catch (error) {
    console.log(error)
    next(error.message)
  }
}