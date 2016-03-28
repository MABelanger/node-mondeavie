"use strict";

var bodyParser = require('body-parser');
var express = require('express');


// Load routes
var routeCourse = require('./course');
var routeTeacher = require('./teacher');
var routeCourseDescription = require('./courseDescription');

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
  let staticDirs = ['media', 'media/img/course_description'];


  app.use('/media', express.static('media'));
  /*
  for (let staticDir in staticDirs){
    app.use( '/' + staticDir, express.static( staticDir ));
  }
  */

  /**
   * CRUD operations for the course
   */
  app.post('/api/courses', routeCourse().create); // Create
  app.get('/api/courses/:_id', routeCourse().read); // Read
  app.put('/api/courses/:_id', routeCourse().update); // Update
  app.delete('/api/courses/:_id', routeCourse().delete); // Delete
  app.get('/api/courses', routeCourse().list); // List

  /* 
   * CRUD operations for the teacher
   */
  app.post('/api/courses/:course_id/teachers', routeTeacher().create); // Create
  app.get('/api/courses/:course_id/teachers/:_id', routeTeacher().read); // Read
  app.put('/api/courses/:course_id/teachers/:_id', routeTeacher().update); // Update
  app.delete('/api/courses/:course_id/teachers/:_id', routeTeacher().delete); // Delete
  app.get('/api/courses/:course_id/teachers', routeTeacher().list); // List

  /* 
   * CRUD operations for course description
   */
  app.post('/api/courses/:course_id/teachers/:teacher_id/course_description', routeCourseDescription().create); // Create
  app.get('/api/courses/:course_id/teachers/:teacher_id/course_description', routeCourseDescription().read); // Read
  app.put('/api/courses/:course_id/teachers/:teacher_id/course_description', routeCourseDescription().update); // Update
  app.delete('/api/courses/:course_id/teachers/:teacher_id/course_description', routeCourseDescription().delete); // Delete
  //app.get('/api/courses/:course_id/teachers', routeTeacher().list); // List

};