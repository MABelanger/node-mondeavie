"use strict";

var mongoose = require('mongoose');
var Course = require('../schemas/embed/course');
var utils = require('../utils/utils');

var BASE_IMG_URL = 'media/img/course_description/'; // TODO: add constant module

// /app/courses/:courseId/teachers/:teacherId/courseDescription/courseTypes/
// :courseTypesId/schedules/:schedulesId/testingDays/:testingDaysId


function isValidId(id){
  return mongoose.Types.ObjectId.isValid(id);
}

function _findCourseTeacher(course_id, teacher_id){
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
function _courseSave(ref){
  let course =  ref.course;
  let teacher_id = ref.teacher_id;
  course.save(function(err, course){
    // return only the course description added
    let courseDescription = ref.course.teachers.id(teacher_id).course;
    ref.res.json(courseDescription);
  });
}


module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    console.log('create')
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseDescription = req.body;

    _findCourseTeacher(course_id, teacher_id)
      .then( (data) => {

        let course = data.course
        let teacher = data.teacher;

        // need to update the course description by the document course
        // we can't do a .save() on a teacher
        course.teachers.id(teacher_id).course = courseDescription;
        _courseSave({course:course, res:res, teacher_id:teacher_id});
      }, (err) => {
        res.json(err);
      });

  };

  functions.read = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;

    _findCourseTeacher(course_id, teacher_id)
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

    console.log('update')
    _findCourseTeacher(course_id, teacher_id)
      .then( (data) => {
        console.log('json.image.dataUri')
        let course = data.course;
        let teacher = data.teacher;

        // if courseDescription do not exist, create an empty object 
        // to add properties to it.
        if (! course.teachers.id(teacher_id).course){ // check if is not null
          course.teachers.id(teacher_id).course = {};
        }

        for (let attName in json) {
          course.teachers.id(teacher_id).course[attName] = json[attName];
        }

        // check if is a new upload image. If so,
        // save it on the file and save the path to the db.
        if (json.image && json.image.dataUri) {
          let dataUri = json.image.dataUri;

          // we don't need the filename of the client
          // the fileName is renamed with teacherSlug_courseSlug.jpg
          //let fileName = json.image.fileName;
          let fileName = teacher.slug +'_' + course.slug + '.jpg';

          let url = BASE_IMG_URL + fileName;

          utils.saveImage(dataUri, url, function(url){
            // set the path to the image
            let image = {
              url: url
            }
            course.teachers.id(teacher_id).course.image = image;
            _courseSave({course:course, res:res, teacher_id:teacher_id});
          });
        } else {
          _courseSave({course:course, res:res, teacher_id:teacher_id});
        }
      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res) {
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;

    _findCourseTeacher(course_id, teacher_id)
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
