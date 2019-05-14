require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const cors = require('cors')

const authMiddleware = require('./auth')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.options('*',cors())
app.use(cors())

//Check the origin of the request
var whitelist = [[process.env.FRONTEND_ADDRESS]]
var corsOptionsDelegate = function (req, callback) {
  console.log("called")
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(authMiddleware)

var routes = require('./routes');
routes(app);

//Handle error codes
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' was not found'})
});

const startServer = async () => {
  const port = process.env.SERVER_PORT || 3000
  await promisify(app.listen).bind(app)(port)
  console.log(`Listening on port ${port}`)
}

startServer()