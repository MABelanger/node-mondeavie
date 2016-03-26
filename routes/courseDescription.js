"use strict";

var mongoose = require('mongoose');
var Course = require('../schemas/embed/course');

// /app/courses/:courseId/teachers/:teacherId/courseDescription/courseTypes/
// :courseTypesId/schedules/:schedulesId/testingDays/:testingDaysId


function isValidId(id){
  return mongoose.Types.ObjectId.isValid(id);
}

function findCourseTeacher(course_id, teacher_id){
  var promise = new Promise(function(resolve, reject) {
    Course.findById( course_id, (err, course) => {
      if (! err ) {
        let teacher = course.teachers.id(teacher_id);
        if (teacher){
          let res = {
            course: course,
            teacher: teacher
          }
          resolve(res);
        }
        else {
          reject("no id teacher found !");
        }
      }
      else {
        reject(err);
      }
    });
  });
  return promise;
}
module.exports = function () {

  var functions = {};

  functions.create = function(req, res){

    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseDescription = req.body;

    findCourseTeacher(course_id, teacher_id)
      .then( (data) => {
        let course = data.course
        let teacher = data.teacher;

        // need to update the course description by the document course
        // we can't do a .save() on a teacher
        course.teachers.id(teacher_id).course = courseDescription;
        course.save(function(err, course){
          // return only the course description added
          let courseDescription = course.teachers.id(teacher_id).course;
          res.json(courseDescription);
        });
      }, (err) => {
        res.json(err);
      });

  };

  functions.read = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;

    findCourseTeacher(course_id, teacher_id)
      .then( (data) => {
        let course = data.course
        let teacher = data.teacher;

        let courseDescription = teacher.course; // TODO, rename course by courseDescription in mongodb

        res.json(courseDescription);
      }, (err) => {
        res.json(err);
      });

  }

  functions.update = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let json = req.body;

    findCourseTeacher(course_id, teacher_id)
      .then( (data) => {
        let course = data.course;
        let teacher = data.teacher;

        let courseDescription = course.teachers.id(teacher_id).course;
        if (courseDescription){ // check if is not null
          for (let attName in json) {
            courseDescription[attName] = json[attName];
          }
        }else {
          course.teachers.id(teacher_id).course = json;
        }
        course.save(function(err, course){
          // return only the course description added
          let courseDescription = course.teachers.id(teacher_id).course;
          res.json(courseDescription);
        });
      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;

    findCourseTeacher(course_id, teacher_id)
      .then( (data) => {
        let course = data.course
        let teacher = data.teacher;

        course.teachers.id(teacher_id).course = undefined;
        course.save(function(err, course){
          res.json({
            'status': 'deleted'
          });
        });
      }, (err) => {
        res.json(err);
      });
  }

  return functions;
};
