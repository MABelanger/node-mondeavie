"use strict";

var dbUtils=                   require('../../utils/dbCourse');
var utils =                    require('../../utils/utils');

var BASE_IMG_URL = 'media/img/course_description/'; // TODO: add constant module

function _getObj(course, idList){
  let teacher_id = idList[0];
  return course.teachers.id( teacher_id ).course;
}


// we don't need the filename of the client
// the fileName is renamed with teacherSlug_courseSlug.jpg
//let fileName = json.image.fileName;
function _updateImage(json, course, teacher, res){

  let dataUri = json.image.dataUri;
  let fileName = teacher.slug +'_' + course.slug + '.jpg';
  let url = BASE_IMG_URL + fileName;




  let fileNameOriginal = teacher.slug +'_' + course.slug + '_original' + '.jpg';
  let urlOriginal = BASE_IMG_URL + fileNameOriginal;


  let fileNameResize = teacher.slug +'_' + course.slug + '.jpg';
  let urlResize = BASE_IMG_URL + fileNameResize;


  // save the original
  utils.saveImage(dataUri, urlOriginal, {width:null, height:null}, function(url){
    // save the smaller
    utils.saveImage(dataUri, urlResize, {width:300, height:null}, function(url){
      // set the path to the image
      let image = {
        url: url
      }
      course.teachers.id(teacher._id).course.image = image;
      dbUtils.saveCourse(course, res, [teacher._id], _getObj);
    });
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

    dbUtils.findCourse(course_id)
      .then( (course) => {
        let teacher = course.teachers.id(teacher_id);
        teacher.course = dbUtils.updateAttributes(teacher.course, json);

        // check if is a new upload image. If so,
        // save it on the file and save the path to the db.
        if (json.image && json.image.dataUri) {
          _updateImage(json, course, teacher, res);

        } else {
          dbUtils.saveCourse(course, res, [teacher._id], _getObj);
        }
      }, (err) => {

        res.json(err);
      });
  }

  functions.delete = function(req, res) {
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        // put the object to undefined so the field is not present into the db.
        course.teachers.id(teacher_id).course = undefined;
        dbUtils.updateDeletedObj(course, res);
      }, (err) => {
        res.json(err);
      });
  }

  return functions;
};
