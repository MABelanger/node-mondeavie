"use strict";

var mongoose = require('mongoose');
var Course = require('../schemas/embed/course');

// /app/courses/:courseId/teachers/:teacherId/course/courseTypes/
// :courseTypesId/schedules/:schedulesId/testingDays/:testingDaysId


function isValidId(id){
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    course = new Course(req.body);
    course.save( function(err, createdCourse){
      if( err ) throw err;
      res.json( createdCourse );
    });
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

    // we don't call update by id because the hook pre-update is not supported
    // so call save method instead.
    // Course.findByIdAndUpdate(_id, json, callback);

    Course.findById( _id, function(err, course){
      // copy all attributes from json to the course
      for (var attName in json) {
        course[attName] = json[attName];
      }
      course.save(function(err, updatedCourse){
        if( err ) throw err;
        res.json( updatedCourse );
      });
    });
  }

  functions.delete = function(req, res){
    let _id = req.params._id;
    if(isValidId(_id)) {
      Course.findByIdAndRemove(_id, function(err){
        if( err ) throw err;
        res.json({
          'status': 'deleted',
          '_id' : _id
        });
      });
    }else{
      res.json({
        'status': 'ERROR: id invalid',
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
