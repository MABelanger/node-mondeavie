"use strict";

var Course                 = require('../../schemas/embed/course');
var dbUtils                = require('../../utils/dbCourse');


function _getObj(course, idList){
  return course;
}


module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    let course = new Course(req.body);
    dbUtils.saveCourse(course, res, [course._id], _getObj);
  };

  functions.read = function(req, res){
    var course_id =  req.params.course_id;
    dbUtils.findCourse(course_id)
      .then( (course) => {
        res.json(course);
      }, (err) => {
        res.json(err);
      });
  }

  functions.update = function(req, res){
    var course_id =  req.params.course_id;
    var json = req.body;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        dbUtils.updateAttributes(course, json);
        dbUtils.saveCourse(course, res, [course_id], _getObj);

      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res){
    let course_id = req.params.course_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        Course.findByIdAndRemove(course_id, function(err){
          res.json({'status': 'deleted'});
        });

      }, (err) => {
        res.json(err);
      });
  }

  functions.list = function(req, res){
    Course.find({}, function(err, courses){
      if( err ) throw err;
      res.json(courses);
    });
  }

  return functions;
};
