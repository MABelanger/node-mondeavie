"use strict";

var mongoose               = require('mongoose');
var Course                 = require('../schemas/embed/course');
var dbUtils                = require('../utils/db');


function _saveCourse(course, res){
  course.save( function(err, savedCourse){
    if( err ) {
      res.status(400);
      res.json( err );
    } else {
      res.json( savedCourse );
    }
  });
}

function _updateAttributes(obj, json){
  // update all attributes specified in the json
  for (var attName in json) {
    obj[attName] = json[attName];
  }
}

module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    let course = new Course(req.body);
    _saveCourse(course, res);
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
      _updateAttributes(course, json);
      _saveCourse(course, res);
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
