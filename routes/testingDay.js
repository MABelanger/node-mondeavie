"use strict";

var dbUtils=                   require('../utils/db');

function _getObj(course, idList){
  let teacher_id = idList[0];
  let courseType_id = idList[1];
  let schedule_id = idList[2];
  let testingDay_id = idList[3];

  let testingDays = course.teachers.id( teacher_id )
                  .course.courseTypes.id( courseType_id )
                  .schedules.id( schedule_id )
                  .testingDays

  if( testingDay_id ) {
    let testingDay = testingDays.id(testingDay_id);
    return testingDay;
  }

  // if no id specified, return the last created one.
  return testingDays[ testingDays.length -1 ];
}

module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;
    let testingDay_id = null;
    let obj = req.body;


    dbUtils.findCourse(course_id)
      .then( (course) => {
        course.teachers.id( teacher_id )
                .course.courseTypes.id( courseType_id )
                .schedules.id( schedule_id )
                .testingDays.push( obj );

        dbUtils.saveCourse(course, res, [teacher_id, courseType_id, schedule_id, testingDay_id], _getObj);
      }, (err) => {
        res.json(err);
      });
  };

  functions.read = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;
    let testingDay_id = req.params.testing_day_id;

    dbUtils.findCourse(course_id)
      .then( (course) => {

        let testingDay = course.teachers.id( teacher_id )
                        .course.courseTypes.id( courseType_id )
                        .schedules.id( schedule_id )
                        .testingDays.id( testingDay_id )

        res.json(testingDay);
      }, (err) => {
        res.json(err);
      });
  }

  functions.update = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;
    let testingDay_id = req.params.testing_day_id;
    let json = req.body;


    dbUtils.findCourse(course_id)
      .then( (course) => {
        let testingDay = course.teachers.id( teacher_id )
            .course.courseTypes.id( courseType_id )
            .schedules.id(schedule_id)
            .testingDays.id( testingDay_id );

        testingDay = dbUtils.updateAttributes(testingDay, json);
        dbUtils.saveCourse(course, res, [teacher_id, courseType_id, schedule_id, testingDay_id], _getObj);

      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res) {
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;
    let testingDay_id = req.params.testing_day_id;


    dbUtils.findCourse(course_id)
      .then( (course) => {

        course.teachers.id( teacher_id )
          .course.courseTypes.id( courseType_id )
          .schedules.id( schedule_id )
          .testingDays.pull( testingDay_id );

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
                        .testingDays

        res.json(schedules);
      }, (err) => {
        res.json(err);
      });
  }

  return functions;
};

