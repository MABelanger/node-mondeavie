"use strict";

var mongoose = require('mongoose');
var slug = require('slug');
var print = console.log.bind(console, '>')

var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

require('../../../schemas/embed/course.js')();
var Course = mongoose.model('Course');


function errHandle(err){
  console.log('err', err);
}

function cbUpdateSlug (err, numAffected) {
  // numAffected is the number of updated documents
  console.log(numAffected);
}

function getTeacherCoursesSlug(teacher){
  if(teacher.course) {
    var _slug = slug(teacher.course.courseType).toLowerCase();
    teacher.course.slug = _slug;
  }
  return teacher;
}


function courseTypeSlug(course, teacher){
  var courseTypes = teacher.course.courseTypes;
  courseTypes.map(function(courseType, index){
    var _slug = slug(courseType.name).toLowerCase();
    courseTypes[ index ].slug = _slug;
  });

  var conditions = { '_id' : course._id , 'teacher._id' : teacher._id }
    , update = { 'courseTypes' : courseTypes }
    , options = { multi: true };

  Course.update(conditions, update, options, cbUpdateSlug);
}


function teacherSlug(course){
  var teachers = course.teachers;
  teachers.map(function(teacher, index){
    var _slug = slug(teacher.firstName + ' ' + teacher.lastName).toLowerCase();
    teachers[ index ].slug = _slug;
    teachers[ index ] = getTeacherCoursesSlug(teachers[ index ]);

    courseTypeSlug(course, teacher);
  });

  var conditions = { '_id' : course._id }
    , update = { 'teachers' : teachers }
    , options = { multi: true };

  Course.update(conditions, update, options, cbUpdateSlug);


}

function courseSlug(courses){
  courses.map(function(course){
    //course._id = course.name.toLowerCase();
    var _slug = slug(course.name).toLowerCase();
    var conditions = { '_id' : course._id }
      , update = { 'slug' : _slug }
      , options = { multi: true };

    Course.update(conditions, update, options, cbUpdateSlug);

    teacherSlug(course);
  });
}

mongoose.connect('mongodb://localhost/mondeavie-embed-urlid', function(err) {
  // if we failed to connect, abort
  if (err) throw err;


  Course
  .find({})
  .exec(function(err, courses) {
    if (err) throw err;
    courseSlug(courses)
  });




});