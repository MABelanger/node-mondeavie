"use strict";

var express = require('express');
var mongoose = require('mongoose');
var sharp = require('sharp');

// get ragument command lines

// --port=9000 -apiPublic
var argv = require('minimist')(process.argv.slice(2));

// Constants
// mondeavie-free-days
var URL_MONGO = 'mongodb://localhost/mondeavie';
var PORT = argv.port;
var IS_API_PUBLIC = argv.apiPublic;

console.log('argv', argv)
// Load the express application
var app = express();

app.isApiPublic = IS_API_PUBLIC;

// Load all routes
require('./routes')(app);

// Connect to monbodb
mongoose.connect(URL_MONGO, function(err){
  if (err) throw err;
});

// Listen to the port 3000
app.listen(PORT);

console.log('Running on port' + PORT);