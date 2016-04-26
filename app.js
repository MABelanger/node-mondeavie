"use strict";

var express = require('express');
var mongoose = require('mongoose');
var sharp = require('sharp');

// Constants
var URL = 'mongodb://localhost/mondeavie-free-days';

// Load the express application
var app = express();

// Load all routes
require('./routes')(app);

// Connect to monbodb
mongoose.connect(URL, function(err){
  if (err) throw err;
});

// Listen to the port 3000
app.listen(3000);

console.log('Running on port 3000');


