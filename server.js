const express = require('express');
const app = express();
const api_url="https://one.nhtsa.gov/webapi/api/SafetyRatings";
// utility and validator
var util = require('util'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator');
// async
var async=require('async');
var Client = require('node-rest-client').Client;
var client = new Client();
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
//logger
var logger = require('morgan');
//controllers
var home=require('./controllers/home_controller.js')();
var vehicles=require('./controllers/vehicles_controller.js')(api_url,util,async,client);
// routes
app.get('/',home.index);
app.get('/vehicles/:year/:manufacturer/:model',vehicles.index);
app.post('/vehicles',vehicles.create);
// logger
app.use(logger('dev'));
// server
app.listen(8888, function () {
  console.log('Server running on port 8888!')
})