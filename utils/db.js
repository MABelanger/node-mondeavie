"use strict";

var mongoose = require('mongoose');
var Course = require('../schemas/embed/course');


function isValidId(id){
  return mongoose.Types.ObjectId.isValid(id);
}

function findCourse(course_id){
  var promise = new Promise(function(resolve, reject) {
    Course.findById( course_id, (err, course) => {
      if (! err ) {
        resolve(course);
      }
      else {
        reject(err);
      }
    });
  });
  return promise;
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

/**
 * Save the course and return the result of the courseDescription
 */
function courseSave(ref){
  let course =  ref.course;
  let teacher_id = ref.teacher_id;
  course.save(function(err, course){
    // return only the course description added
    
    let courseDescription = ref.course.teachers.id(teacher_id).course;
    ref.res.json(courseDescription);
  });
}

var Utils = {
  findCourse: findCourse,
  findCourseTeacher : findCourseTeacher,
  courseSave: courseSave
}

module.exports = Utils;
