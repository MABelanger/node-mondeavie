"use strict";

var dbUtils=                   require('../utils/db');

module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;
    let obj = req.body;


    dbUtils.findCourse(course_id)
      .then( (course) => {
        course.teachers.id( teacher_id )
                .course.courseTypes.id( courseType_id )
                .schedules.id( schedule_id )
                .testingDays.push( obj );

        course.save(function(err, course){
          // return only the schedule added
          let testingDays = course.teachers.id( teacher_id )
                          .course.courseTypes.id( courseType_id )
                          .schedules.id( schedule_id )
                          .testingDays;
          let testingDay = testingDays[ testingDays.length -1 ];
          res.json(testingDay);
        });
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

        for (let attName in json) {
          course.teachers.id( teacher_id )
            .course.courseTypes.id( courseType_id )
            .schedules.id(schedule_id)
            .testingDays.id( testingDay_id )
            [attName] = json[attName];
        }
        course.save(function(err, course){
          // return only the testingDay added
          let testingDay = course.teachers.id( teacher_id )
                          .course.courseTypes.id( courseType_id )
                          .schedules.id(schedule_id)
                          .testingDays.id( testingDay_id )
          res.json(testingDay);
        });

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

