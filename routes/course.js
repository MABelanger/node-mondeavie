"use strict";

var mongoose               = require('mongoose');
var Course                 = require('../schemas/embed/course');
var dbUtils                = require('../utils/db');


function _getObj(course, obj_id){
  return course;
}


module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    let course = new Course(req.body);
    dbUtils.saveCourse(course, res, course._id, _getObj);
  };

  functions.read = function(req, res){
    Course.findById(req.params._id, function(err, course){
      if( err ) throw err;
      res.json(course);
    });
  }

  functions.update = function(req, res){
    var _id =  req.params._id;
    var json = req.body;

  /*
   * we don't call findByIdAndUpdate in update fct because 
   * the hook pre-update is not supported
   * so call save method instead.
   */
    Course.findById( _id, function(err, course){
        dbUtils.updateAttributes(course, json);
        dbUtils.saveCourse(course, res, course._id, _getObj);
    });
  }

  functions.delete = function(req, res){
    let _id = req.params._id;
    if( !dbUtils.isValidId(_id) ) {
      res.json({
        'status': 'ERROR: id invalid',
      });
    } else {
      Course.findByIdAndRemove(_id, function(err){
        if( err ) throw err;
        res.json({
          'status': 'deleted',
          '_id' : _id
        });
      });
    }
  }

  functions.list = function(req, res){
    Course.find({}, function(err, courses){
      if( err ) throw err;
      res.json(courses);
    });
  }

  return functions;
};
