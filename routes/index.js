"use strict";

var bodyParser = require('body-parser');
var express = require('express');
var jwt     = require('express-jwt');
var config  = require('./user/config')

module.exports = function (app) {

  // Parse the body into Obj
  app.use(bodyParser.json({limit: '50mb'}));
  //app.use(bodyParser.urlencoded({limit: '50mb'}));

  app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
     res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
     next();
  });

  // Show message to use path /api if user try to use the root path
  app.get('/', function(req, res){
    res.send('use /api');
  });

  var jwtCheck = jwt({
    secret: config.secret
  });


  app.use('/api/sessions/private', jwtCheck);

  // fallback if no token is sended.
  app.use(function (err, req, res, next) {
    console.log('req.headers', req.headers.authorization);
    if (err.name === 'UnauthorizedError') { 
      res.send(401, 'invalid token...');
    }
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