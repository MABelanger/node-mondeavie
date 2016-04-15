"use strict";

var dbUtils=                   require('../utils/db');
var utils =                    require('../utils/utils');

var findCourseTeacher = dbUtils.findCourseTeacher;
var courseSave = dbUtils.courseSave;

// /app/courses/:courseId/teachers/:teacherId/courseDescription/courseTypes/
// :courseTypesId/schedules/:schedulesId/testingDays/:testingDaysId

module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    console.log('create')
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType = req.body;

    dbUtils.findCourse(course_id)
      .then( (course) => {
        // add the course Type to the array, save it and return the course Type saved.
        course.teachers.id(teacher_id)
              .course.courseTypes.push( courseType );
        course.save(function(err, course){
          let courseType = course.teachers.id(teacher_id)
                          .course.courseTypes[ course.teachers.id(teacher_id)
                          .course.courseTypes.length -1 ];
          res.json(courseType);
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
    console.log('update')
    let course_id = req.params.course_id;
    let teacher_id = req.params.teacher_id;
    let courseType_id = req.params.course_type_id;
    let json = req.body;

    dbUtils.findCourse(course_id)
      .then( (course) => {

        let courseType = course.teachers.id(teacher_id)
                        .course.courseTypes.id(courseType_id);


        courseType = dbUtils.updateAttributes(courseType, json);

        course.save(function(err, course){
          let courseType = course.teachers.id(teacher_id).course.courseTypes.id(courseType_id);
          res.json(courseType);
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

    dbUtils.findCourse(course_id)
      .then( (course) => {

        course.teachers.id(teacher_id).course.courseTypes.pull(courseType_id)
        course.save(function(err, course){
          res.json({
            'status': 'deleted'
          });
        });
      }, (err) => {
        res.json(err);
      });
  }

  functions.list = function(req, res){
    console.log('list');
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
