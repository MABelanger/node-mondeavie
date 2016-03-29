"use strict";

var dbUtils=                   require('../utils/db');
var utils =                    require('../utils/utils');

var BASE_IMG_URL = 'media/img/course_description/'; // TODO: add constant module

var findCourseTeacher = dbUtils.findCourseTeacher;
var courseSave = dbUtils.courseSave;

// /app/courses/:courseId/teachers/:teacherId/courseDescription/courseTypes/
// :courseTypesId/schedules/:schedulesId/testingDays/:testingDaysId


module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    console.log('create')
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
        courseSave({course:course, res:res, teacher_id:teacher_id});
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

    console.log('update')
    findCourseTeacher(course_id, teacher_id)
      .then( (data) => {
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
            courseSave({course:course, res:res, teacher_id:teacher_id});
          });
        } else {
          courseSave({course:course, res:res, teacher_id:teacher_id});
        }
      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res) {
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
