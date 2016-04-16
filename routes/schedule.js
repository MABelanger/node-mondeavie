"use strict";

var dbUtils=                   require('../utils/db');

function _getObj(course, idList){
  let teacher_id = idList[0];
  let courseType_id = idList[1];
  let schedule_id = idList[2];

  let schedules = course.teachers.id( teacher_id )
                  .course.courseTypes.id( courseType_id )
                  .schedules;

  if( schedule_id ) {
    let schedule = schedules.id(schedule_id);
    return schedule;
  }

  // if no id specified, return the last created one.
  return schedules[ schedules.length -1 ];
}

module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = null;
    let obj = req.body;


    dbUtils.findCourse(course_id)
      .then( (course) => {
        course.teachers.id( teacher_id )
                .course.courseTypes.id( courseType_id )
                .schedules.push( obj );
        dbUtils.saveCourse(course, res, [teacher_id, courseType_id, schedule_id], _getObj);
      }, (err) => {
        res.json(err);
      });
  };

  functions.read = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {

        let schedule = course.teachers.id( teacher_id )
                        .course.courseTypes.id( courseType_id )
                        .schedules.id(schedule_id);

        res.json(schedule);
      }, (err) => {
        res.json(err);
      });
  }

  functions.update = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;
    let json = req.body;


    dbUtils.findCourse(course_id)
      .then( (course) => {
        let schedule = course.teachers.id( teacher_id )
            .course.courseTypes.id( courseType_id )
            .schedules.id(schedule_id);

        schedule = dbUtils.updateAttributes(schedule, json);

        dbUtils.saveCourse(course, res, [teacher_id, courseType_id, schedule_id], _getObj);

      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res) {
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;


    dbUtils.findCourse(course_id)
      .then( (course) => {

        course.teachers.id( teacher_id )
          .course.courseTypes.id( courseType_id )
          .schedules.pull(schedule_id);

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
                        .schedules;

        res.json(schedules);
      }, (err) => {
        res.json(err);
      });
  }

  return functions;
};
