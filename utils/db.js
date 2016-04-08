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
  // if courseDescription do not exist, create an empty object 
  // to add properties to it.
  if (! obj ){ // check if is not null
    obj = {};
  }
  // update all attributes specified in the json
  for (var attName in json) {
    obj[attName] = json[attName];
  }
  return obj;
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

var Utils = {
  isValidId: isValidId,
  findCourse: findCourse,
  saveCourse: saveCourse,
  updateAttributes: updateAttributes
}

module.exports = Utils;
