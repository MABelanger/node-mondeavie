"use strict";

var dbUtils=                   require('../utils/db');

function _getObj(course, idList){
  let teacher_id = idList[0];
  let courseType_id = idList[1];

  let courseTypes = course.teachers.id(teacher_id)
                  .course.courseTypes;

  if( courseType_id ) {
    let courseType = courseTypes.id(courseType_id);
    return courseType;
  }

  // if no id specified, return the last created one.
  return courseTypes[ courseTypes.length -1 ];
}

module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = null;
    let courseType = req.body;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        // add the course Type to the array, save it and return the course Type saved.
        course.teachers.id(teacher_id)
              .course.courseTypes.push( courseType );

        dbUtils.saveCourse(course, res, [teacher_id, courseType_id], _getObj);
      }, (err) => {
        res.json(err);
      });

  };

  functions.read = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        let courseType = course.teachers.id(teacher_id)
                        .course.courseTypes.id(courseType_id);

        res.json(courseType);
      }, (err) => {
        res.json(err);
      });
  }

  functions.update = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let json = req.body;

    dbUtils.findCourse(course_id)
      .then( (course) => {

        let courseType = course.teachers.id(teacher_id)
                        .course.courseTypes.id(courseType_id);

        courseType = dbUtils.updateAttributes(courseType, json);

        dbUtils.saveCourse(course, res, [teacher_id, courseType_id], _getObj);

      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res) {
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {

        course.teachers.id(teacher_id).course.courseTypes.pull(courseType_id);
        dbUtils.updateDeletedObj(course, res);

      }, (err) => {
        res.json(err);
      });
  }

  functions.list = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        let teacher = course.teachers.id(teacher_id);

        if(teacher.course){
          res.json(teacher.course.courseTypes);
        }else {
          res.json();
        }
      }, (err) => {
        res.json(err);
      });
  }

  return functions;
};
