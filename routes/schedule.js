"use strict";

var dbUtils=                   require('../utils/db');
var utils =                    require('../utils/utils');


var findCourse = dbUtils.findCourse;
var courseSave = dbUtils.courseSave;


module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    console.log('create')
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let obj = req.body;


    findCourse(course_id)
      .then( (course) => {
        course.teachers.id( teacher_id )
                .course.courseTypes.id( courseType_id )
                .schedules.push( obj );

        course.save(function(err, course){
          // return only the schedule added
          let schedules = course.teachers.id( teacher_id )
                          .course.courseTypes.id( courseType_id )
                          .schedules;
          let schedule = schedules[ schedules.length -1 ];
          res.json(schedule);
        });
      }, (err) => {
        res.json(err);
      });
  };

  functions.read = function(req, res){
    console.log('read');
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;

    findCourse(course_id)
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
    console.log('update')
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;
    let json = req.body;


    findCourse(course_id)
      .then( (course) => {

        for (let attName in json) {
          course.teachers.id( teacher_id )
            .course.courseTypes.id( courseType_id )
            .schedules.id(schedule_id)
            [attName] = json[attName];
        }
        course.save(function(err, course){
          // return only the schedule added
          let schedule = course.teachers.id( teacher_id )
                          .course.courseTypes.id( courseType_id )
                          .schedules.id(schedule_id);
          res.json(schedule);
        });

      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res) {
    console.log('delete');
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;


    findCourse(course_id)
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
    console.log('list');
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let schedule_id = req.params.schedule_id;

    findCourse(course_id)
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
