"use strict";

var mongoose = require('mongoose');
var Course = require('../schemas/embed/course');


function isValidId(id){
  return mongoose.Types.ObjectId.isValid(id);
}


function _saveCourse(course, res, isDelete, idList, getObjCb){

  course.save( function(err, course){
    if( err ) {
      res.status(400);
      res.json(err);
    } else {
      // if is no delete, call the cb fct with the right args
      if( isDelete ) {
        res.json({'status': 'deleted'});
      // 
      } else {
        res.json(getObjCb(course, idList));
      }
    }
  });
}


function saveCourse(course, res, idList, getObjCb){
  let isDelete = false;
  _saveCourse(course, res, isDelete, idList, getObjCb);
}

function updateDeletedObj(course, res){
  let isDelete = true;
  _saveCourse(course, res, isDelete);
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

var DbCourse = {
  isValidId: isValidId,
  findCourse: findCourse,
  saveCourse: saveCourse,
  updateDeletedObj: updateDeletedObj,
  updateAttributes: updateAttributes
};

module.exports = DbCourse;
