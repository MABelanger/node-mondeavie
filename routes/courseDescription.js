"use strict";

var dbUtils=                   require('../utils/db');
var utils =                    require('../utils/utils');

var BASE_IMG_URL = 'media/img/course_description/'; // TODO: add constant module

var courseSave = dbUtils.courseSave;


function _getObj(course, obj_id){
  return course.teachers.id( obj_id ).course;
}


// we don't need the filename of the client
// the fileName is renamed with teacherSlug_courseSlug.jpg
//let fileName = json.image.fileName;
function _updateImage(json, course, teacher, res){
  let dataUri = json.image.dataUri;
  let fileName = teacher.slug +'_' + course.slug + '.jpg';
  let url = BASE_IMG_URL + fileName;

  utils.saveImage(dataUri, url, function(url){
    // set the path to the image
    let image = {
      url: url
    }
    course.teachers.id(teacher._id).course.image = image;
    dbUtils.saveCourse(course, res, teacher._id, _getObj);
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

    dbUtils.findCourse(course_id)
      .then( (course) => {
        let teacher = course.teachers.id(teacher_id);
        teacher.course = dbUtils.updateAttributes(teacher.course, json);

        // check if is a new upload image. If so,
        // save it on the file and save the path to the db.
        if (json.image && json.image.dataUri) {
          _updateImage(json, course, teacher, res);

        } else {
          dbUtils.saveCourse(course, res, teacher._id, _getObj);
        }
      }, (err) => {

        res.json(err);
      });
  }

  functions.delete = function(req, res) {
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;

    dbUtils.findCourse(course_id)
      .then( (data) => {
        // put the object to undefined so the field is not present into the db.
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
