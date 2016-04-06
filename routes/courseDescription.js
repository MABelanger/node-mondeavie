"use strict";

var dbUtils=                   require('../utils/db');
var utils =                    require('../utils/utils');

var BASE_IMG_URL = 'media/img/course_description/'; // TODO: add constant module

var findCourseTeacher = dbUtils.findCourseTeacher;
var courseSave = dbUtils.courseSave;

// we don't need the filename of the client
// the fileName is renamed with teacherSlug_courseSlug.jpg
//let fileName = json.image.fileName;
function _updateImage(json, fileName, course, teacherId, res){
  let dataUri = json.image.dataUri;

  let url = BASE_IMG_URL + fileName;

  utils.saveImage(dataUri, url, function(url){
    // set the path to the image
    let image = {
      url: url
    }
    course.teachers.id(teacherId).course.image = image;
    courseSave({course:course, res:res, teacher_id:teacherId});
  });
};


module.exports = function () {

  var functions = {};

  // No create

  // Read
  functions.read = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        let courseDescription = course.teachers.id(teacher_id).course;
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
          let fileName = teacher.slug +'_' + course.slug + '.jpg';
          _updateImage(json, fileName, course, teacher_id, res);
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
