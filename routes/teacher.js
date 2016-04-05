"use strict";

var mongoose = require('mongoose');
var Course = require('../schemas/embed/course');

var dbUtils =                   require('../utils/db');

var findCourse = dbUtils.findCourse;

// /app/courses/:courseId/teachers/:teacherId/course/courseTypes/
// :courseTypesId/schedules/:schedulesId/testingDays/:testingDaysId


module.exports = function () {

  var functions = {};

  functions.create = function(req, res){

    let course_id = req.params.course_id;

    findCourse(course_id)
      .then( (course) => {
        course.teachers.push(req.body);
        course.save(function(err, course){
          // return only the teacher added
          if( err ) {
            res.status(400);
            res.json( err );
          } else {
            let teacher = course.teachers[ course.teachers.length -1 ];
            res.json(teacher);
          }
        });
      }, (err) => {
        // course not found
        res.json(err);
      });

  };

  functions.read = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params._id;

    findCourse(course_id)
      .then( (course) => {
        let teacher = course.teachers.id(teacher_id);
        res.json(teacher);
      }, (err) => {
        res.json(err);
      });

  }

  functions.update = function(req, res){

    let course_id = req.params.course_id;
    let teacher_id = req.params._id;
    let json = req.body;

    findCourse(course_id)
      .then( (course) => {
        let teacher = course.teachers.id(teacher_id);
        for (let attName in json) {
          teacher[attName] = json[attName];
        }
        course.save(function(err, course){
          // return only the teacher updated
          let teacher = course.teachers.id(teacher_id);
          res.json(teacher);
        });
      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params._id;

    findCourse(course_id)
      .then( (course) => {
        course.teachers.pull(teacher_id)
        course.save(function(err, course){
          res.json({
            'status': 'deleted',
            '_id' : teacher_id
          });
        });
      }, (err) => {
        res.json(err);
      });
  }

  functions.list = function(req, res){
    let course_id = req.params.course_id;

    findCourse(course_id)
      .then( (course) => {
        let teachers = course.teachers;
        res.json(teachers);
      }, (err) => {
        res.json(err);
      });
  }

  return functions;
};
