"use strict";

var vhost = require('vhost');
var bodyParser = require('body-parser');
var express = require('express');
var path = require("path");
var jwt     = require('express-jwt');
var config  = require('../config');


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
  // app.get('/', function(req, res){
  //   res.send('use /api');
  // });

  var jwtCheck = jwt({
    secret: config.SECRET
  });

  app.jwtCheck = jwtCheck;
  // all /api is private to access we can access it via /public/api

  if(!app.isApiPublic){
    app.use('/api', app.jwtCheck);
  }
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

  // fallback if no token is sended.
  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.send(401, 'invalid token...');
    }
  });

  var reactCalendarDir  = path.join(__dirname,"../app/dist/react-calendar");
  var reactAdminDir     = path.join(__dirname,"../app/dist/react-admin");
  var zeleDir           = path.join(__dirname,"../app/dist/zele");

  // https://github.com/reactjs/react-router/blob/1.0.x/docs/guides/basics/Histories.md
  app.use(vhost('www.blackandrouge.com', express.static(reactCalendarDir))); // Serves first app
  app.use(vhost('admin.blackandrouge.com', express.static(reactAdminDir))); // Serves second app
  app.use(vhost('zele.co', express.static(zeleDir))); // Serves zele.co webpage

  app.use(vhost('_www.blackandrouge.com', express.static(reactCalendarDir))); // Serves first app
  app.use(vhost('_admin.blackandrouge.com', express.static(reactAdminDir))); // Serves second app

  // handle every other route with index.html, which will contain
  // a script tag to your application's JavaScript file(s).
  app.get('*', function (request, response){
    if(request.headers.host == 'www.blackandrouge.com'){
      response.sendFile( path.resolve(__dirname, reactCalendarDir, 'index.html') );

    } else if (request.headers.host == 'admin.blackandrouge.com'){
      response.sendFile( path.resolve(__dirname, reactAdminDir, 'index.html') );
    }
  })


};
