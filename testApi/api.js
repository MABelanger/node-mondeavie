"use strict";

var should                 = require('should');

var restCourse             = require('./rest/course')();
var restTeacher            = require('./rest/teacher')();


var URL = 'http://localhost:3000';
var resource_course = '/api/courses/';
var resource_teacher = null;

var course_id = null;
var teacher_id = null;


describe('Create, Read, Update Course', function() {

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


describe('Create, Read, Update Teacher', function() {

  before(function(done) {
    restTeacher.create(URL, resource_teacher, done, function(_teacher_id){
      teacher_id = _teacher_id;
    });
  });

  it('Should Read the Teacher', function(done){
    restTeacher.read(URL, resource_teacher + teacher_id, done);
  });// ./it

  it('Should Update a Teacher', function(done){
    restTeacher.update(URL, resource_teacher + teacher_id, done);
  });// ./it

}); // ./describe


describe('Delete All', function() {

  before(function(done) {
    done();
  });

  it('Should Delete the Teacher', function(done){
    restTeacher.delete(URL, resource_teacher + teacher_id, done);
  });// ./it

  it('Should Read (no data) after delete Teacher', function(done){
    restTeacher.gone(URL, resource_teacher + teacher_id, done)
  });// ./it

  it('Should Delete the Course', function(done){
    restCourse.delete(URL, resource_course + course_id, done);
  });// ./it

  it('Should Read (no data) after delete Course', function(done){
    restCourse.gone(URL, resource_course + course_id, done)
  });// ./it

}); // ./describe