"use strict";

var mongoose = require('mongoose');
var Course = require('../schemas/embed/course');


function isValidId(id){
  return mongoose.Types.ObjectId.isValid(id);
}

function saveCourse(course, res, obj_id, getObjCb){

  course.save( function(err, course){
    if( err ) {
      res.status(400);
      res.json( err );
    } else {
      let obj = getObjCb(course, obj_id);
      res.json( obj );
    }
  });
}

function updateAttributes(obj, json){
  // update all attributes specified in the json
  for (var attName in json) {
    obj[attName] = json[attName];
  }
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
  courseSave: courseSave,
  isValidId: isValidId,
  saveCourse: saveCourse,
  updateAttributes: updateAttributes
}

module.exports = Utils;
