"use strict";

var should                 = require('should');

var restCourse             = require('./rest/course')();
var restTeacher            = require('./rest/teacher')();


var URL = 'http://localhost:3000';
var RESOURCE_COURSE = '/api/courses/';

describe('CRUD Course', function() {

  let course_id = null;

  before(function(done) {
    restCourse.create(URL, RESOURCE_COURSE, done, function(_course_id){
      course_id = _course_id;
    });
  });

  it('Should Read the Course', function(done){
    restCourse.read(URL, RESOURCE_COURSE + course_id, done);
  });// ./it

  it('Should Update a Course correctly with the right slug and keep existing data', function(done){
    restCourse.update(URL, RESOURCE_COURSE + course_id, done);
  });// ./it

  it('Should Delete the Course', function(done){
    restCourse.delete(URL, RESOURCE_COURSE + course_id, done);
  });// ./it

  it('Should Read (no data) after delete', function(done){
    restCourse.gone(URL, RESOURCE_COURSE + course_id, done)
  });// ./it

}); // ./describe


describe('CRUD Teacher', function() {

  var resource_teacher = null;
  let teacher_id = null;

  before(function(done) {
    restCourse.create(URL, RESOURCE_COURSE, function(){}, function(_course_id){
      resource_teacher = '/api/courses/' + _course_id + '/teachers/';
      restTeacher.create(URL, resource_teacher, done, function(_teacher_id){
        teacher_id = _teacher_id;
      });
    });
  });

  it('Should Read the Teacher', function(done){
    restTeacher.read(URL, resource_teacher + teacher_id, done);
  });// ./it

  it('Should Update a Teacher correctly with the right slug and keep existing data', function(done){
    restTeacher.update(URL, resource_teacher + teacher_id, done);
  });// ./it

  it('Should Delete the Teacher', function(done){
    restTeacher.delete(URL, resource_teacher + teacher_id, done);
  });// ./it

  it('Should Read (no data) after delete', function(done){
    restTeacher.gone(URL, resource_teacher + teacher_id, done)
  });// ./it

}); // ./describe