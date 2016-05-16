"use strict";

var express = require('express');
var mongoose = require('mongoose');
var sharp = require('sharp');

// Constants
// mondeavie-free-days
var URL_MONGO = 'mongodb://localhost/mondeavie';
var PORT = 3000;

// Load the express application
var app = express();

// Load all routes
require('./routes')(app);

// Connect to monbodb
mongoose.connect(URL_MONGO, function(err){
  if (err) throw err;
});

// Listen to the port 3000
app.listen(PORT);

console.log('Running on port' + PORT);


