"use strict";

var should                 = require('should');

var restCourse             = require('./rest/course')();

describe('CRUD Course', function() {

  var URL = 'http://localhost:3000';
  var BASE_RESOURCE = '/api/courses/';
  let course_id = null;

  before(function(done) {
    restCourse.create(URL, BASE_RESOURCE, done, function(_course_id){
      course_id = _course_id;
    });
  });

  it('should read the Course', function(done){
    restCourse.read(URL, BASE_RESOURCE + course_id, done);
  });// ./it

  it('should Update a Course correctly with the right slug and keep existing data', 
    function(done){
      restCourse.update(URL, BASE_RESOURCE + course_id, done);
  });// ./it

  it('Should Delete the Course', function(done){
    restCourse.delete(URL, BASE_RESOURCE + course_id, done);
  });// ./it

  it('should the course be gone (no data) after delete', function(done){
    restCourse.gone(URL, BASE_RESOURCE + course_id, done)
  });// ./it

}); // ./describe