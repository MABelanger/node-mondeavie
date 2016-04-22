"use strict";

var should                 = require('should');

var restCourse             = require('./rest/course')();
var restTeacher            = require('./rest/teacher')();
var restCourseDescription  = require('./rest/courseDescription')();
var restCourseType         = require('./rest/courseType')();


var URL = 'http://localhost:3000';
var resource_course = '/api/courses/';
var resource_teacher = null;
var resource_courseDescription = null;
var resource_courseType = null;

var course_id = null;
var teacher_id = null;
var courseType_id = null;

// Course
describe('Create, Read, Update Course', function() {

  it('Should Create with error the Course', function(done){
    restCourse.createError(URL, resource_course, done);
  });// ./it

  before(function(done) {
    restCourse.create(URL, resource_course, done, function(_course_id){
      course_id = _course_id;
      resource_teacher = '/api/courses/' + _course_id + '/teachers/';
    });
  });

  it('Should Read the Course', function(done){
    restCourse.read(URL, resource_course + course_id, done);
  });// ./it

  it('Should Update a Course correctly with the right slug and keep existing data', function(done){
    restCourse.update(URL, resource_course + course_id, done);
  });// ./it

}); // ./describe


// Teacher
describe('Create, Read, Update Teacher', function() {

  it('Should Create with error the Teacher', function(done){
    restTeacher.createError(URL, resource_teacher, done);
  });// ./it

  before(function(done) {
    restTeacher.create(URL, resource_teacher, done, function(_teacher_id){
      teacher_id = _teacher_id;

      resource_courseDescription = '/api/courses/' + course_id 
                            + '/teachers/' + teacher_id
                            + '/course_description/';

    }); 
  });

  it('Should Read the Teacher', function(done){
    restTeacher.read(URL, resource_teacher + teacher_id, done);
  });// ./it

  it('Should Update a Teacher', function(done){
    restTeacher.update(URL, resource_teacher + teacher_id, done);
  });// ./it

}); // ./describe


// course description
describe('Create, Read, Update CourseDescription', function() {

  it('Should Create with error the CourseDescription', function(done){
    restCourseDescription.createError(URL, resource_courseDescription, done);
  });// ./it

  before(function(done) {
    restCourseDescription.create(URL, resource_courseDescription, done, function(){
      resource_courseType = '/api/courses/' + course_id 
                            + '/teachers/' + teacher_id
                            + '/course_description/course_types/';
    });
  });

  it('Should Read the CourseDescription', function(done){
    restCourseDescription.read(URL, resource_courseDescription, done);
  });// ./it

  it('Should Update a CourseDescription', function(done){
    restCourseDescription.update(URL, resource_courseDescription, done);
  });// ./it

}); // ./describe

// CoursetType
describe('Create, Read, Update CourseType', function() {

  it('Should Create with error the CourseType', function(done){
    //restCourseType.createError(URL, resource_courseType, done);
    done();
  });// ./it

  before(function(done) {
    //resource_courseType = '/api/courses/57145deba174745e29042cd0/teachers/56da1207dc80b7ca7805ea7b/course_description/course_types/';
    restCourseType.create(URL, resource_courseType, done, function(_courseType_id){
      courseType_id = _courseType_id;
    });
  });

  it('Should Read the CourseType', function(done){
    restCourseType.read(URL, resource_courseType + courseType_id, done);
  });// ./it

  it('Should Update a CourseType', function(done){
    restCourseType.update(URL, resource_courseType + courseType_id, done);
  });// ./it

}); // ./describe

describe('Delete All', function() {

  before(function(done) {
    done();
  });


  it('Should Delete the CourseType', function(done){
    restTeacher.delete(URL, resource_courseType + courseType_id, done);
  });// ./it


  it('Should Delete the CourseDescription', function(done){
    console.log('resource_courseDescription', resource_courseDescription)
    //restTeacher.delete(URL, resource_courseDescription, done);
    done();
  });// ./it


  // it('Should Delete the Teacher', function(done){
  //   restTeacher.delete(URL, resource_teacher + teacher_id, done);
  // });// ./it

  // it('Should Read (no data) after delete Teacher', function(done){
  //   restTeacher.gone(URL, resource_teacher + teacher_id, done)
  // });// ./it

  // it('Should Delete the Course', function(done){
  //   restCourse.delete(URL, resource_course + course_id, done);
  // });// ./it

  // it('Should Read (no data) after delete Course', function(done){
  //   restCourse.gone(URL, resource_course + course_id, done)
  // });// ./it

}); // ./describe