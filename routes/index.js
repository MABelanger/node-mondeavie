"use strict";

var bodyParser = require('body-parser');
var express = require('express');


module.exports = function (app) {

  // Parse the body into Obj
  app.use(bodyParser.json({limit: '50mb'}));
  //app.use(bodyParser.urlencoded({limit: '50mb'}));

  app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
  });

  // Show message to use path /api if user try to use the root path
  app.get('/', function(req, res){
    res.send('use /api');
  });

  /**
   * Serve the static files
   */
  app.use('/media', express.static('media'));

  // Load all course routes
  require('./course')(app);

  // Load all conference routes
  require('./conference')(app);

  // Load all user routes
  require('./user')(app);
};