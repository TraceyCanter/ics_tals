'use strict';
const express = require('express')
const bodyParser = require('body-parser')
const apiRoutes = require('../routes/api');
const JSONError = require('../services/JSONError');

console.log(process.env.PORT);

const port = process.env.PORT || 3000
const apiTimeout = 10 * 500;


const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  // res.header('Content-Type: application/json, charset=utf-8')
  res.header('Content-Type: application/x-www-form-urlencoded')
  next()
}

const app = express();
app.use(express.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));
app.use(bodyParser.json({
  limit: '50mb'
}))
app.use(allowCrossDomain);
app.use('/api', apiRoutes);

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  else 
  if (err instanceof JSONError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message
    });
  } else {
    return res.status(500)
  }
}

app.use(errorHandler);
app.listen(port, () => console.log(`Emailservice listening on port ${port}`))
