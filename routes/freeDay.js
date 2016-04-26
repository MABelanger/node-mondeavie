"use strict";

var dbUtils=                   require('../utils/db');

function _getObj(course, idList){
  let teacher_id = idList[0];
  let courseType_id = idList[1];
  let schedule_id = idList[2];
  let freeDay_id = idList[3];

  let freeDays = course.teachers.id( teacher_id )
                  .course.courseTypes.id( courseType_id )
                  .schedules.id( schedule_id )
                  .freeDays

  if( freeDay_id ) {
    let freeDay = freeDays.id(freeDay_id);
    return freeDay;
  }

  // if no id specified, return the last created one.
  return freeDays[ freeDays.length -1 ];
}

module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;
    let freeDay_id = null;
    let obj = req.body;


    dbUtils.findCourse(course_id)
      .then( (course) => {
        course.teachers.id( teacher_id )
                .course.courseTypes.id( courseType_id )
                .schedules.id( schedule_id )
                .freeDays.push( obj );

        dbUtils.saveCourse(course, res, [teacher_id, courseType_id, schedule_id, freeDay_id], _getObj);
      }, (err) => {
        res.json(err);
      });
  };

  functions.read = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;
    let freeDay_id = req.params.free_day_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {

        let freeDay = course.teachers.id( teacher_id )
                        .course.courseTypes.id( courseType_id )
                        .schedules.id( schedule_id )
                        .freeDays.id( freeDay_id );

        res.json(freeDay);
      }, (err) => {
        res.json(err);
      });
  }

  functions.update = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;
    let freeDay_id = req.params.free_day_id;
    let json = req.body;


    dbUtils.findCourse(course_id)
      .then( (course) => {
        let freeDay = course.teachers.id( teacher_id )
            .course.courseTypes.id( courseType_id )
            .schedules.id(schedule_id)
            .freeDays.id( freeDay_id );

        freeDay = dbUtils.updateAttributes(freeDay, json);
        dbUtils.saveCourse(course, res, [teacher_id, courseType_id, schedule_id, freeDay_id], _getObj);

      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res) {
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;
    let freeDay_id = req.params.free_day_id;


    dbUtils.findCourse(course_id)
      .then( (course) => {

        course.teachers.id( teacher_id )
          .course.courseTypes.id( courseType_id )
          .schedules.id( schedule_id )
          .freeDays.pull( freeDay_id );

        dbUtils.updateDeletedObj(course, res);

      }, (err) => {
        res.json(err);
      });
  }

  functions.list = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {

        let schedules = course.teachers.id( teacher_id )
                        .course.courseTypes.id( courseType_id )
                        .schedules.id( schedule_id )
                        .freeDays

        res.json(schedules);
      }, (err) => {
        res.json(err);
      });
  }

  return functions;
};

