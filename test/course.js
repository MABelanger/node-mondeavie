"use strict";

// node ../node_modules/mocha/bin/mocha course.js 

var should = require('should');
var chai = require('chai').should;
var request = require('supertest');  

var course_id = null;
var NAME = 'TEST5';
var NAME_UPDATE = 'TEST6';

function _create(url, resource, done){
  
  var bodyPost = {
    "name": NAME,
  };

  request(url)
    .post(resource)
    .send(bodyPost)
    .set('Connection', 'keep-alive')
    .expect('Content-Type', /json/)
    .expect(200) //Status code
    .end(function(err,res) {
      if (err) {
        throw err;
      }
      res.body.should.have.property('_id');
      res.body.name.should.equal( NAME );
      course_id = res.body._id;
      done();
    });// ./end
}

function _read(url, resource, done){
  request(url)
    .get(resource)
    .end(function (err,res) {
      res.body.name.should.equal( NAME );
      done();
    });// ./end
}

function _update(url, resource, done){
  var bodyPut = {
    "name": NAME_UPDATE
  };

  request(url)
    .put(resource)
    .send(bodyPut)
    .expect('Content-Type', /json/)
    .expect(200) //Status code
    .end(function(err,res) {
      if (err) {
        throw err;
      }
      // Should.js fluent syntax applied
      res.body.name.should.equal(NAME_UPDATE); 
      done();
    });// ./end
}


function _delete(url, resource, done){
  request(url)
    .del(resource)
    .expect('Content-Type', /json/)
    .expect(200) //Status code
    .end(function(err,res) {
      if (err) {
        throw err;
      }
      // Should.js fluent syntax applied
      res.body.status.should.equal('deleted');
      done();
    });// ./end
}

function _gone(url, resource, done){
  request(url)
    .get(resource)
    .end(function (err,res) {
      // hack to check if the res.body is null with should
      if (res.body == null) {
        res.body = 'null';
      }
      res.body.should.equal('null');
      done();
    });// ./end
}


describe('Routing', function() {

  var URL = 'http://localhost:3000';
  var BASE_RESOURCE = '/api/courses/';

  before(function(done) {
    _create(URL, BASE_RESOURCE, done);
  });

  it('should read the Course', function(done){
    _read(URL, BASE_RESOURCE + course_id, done);
  });// ./it

  it('should Update a Course correctly with the right slug and keep existing data', 
    function(done){
      _update(URL, BASE_RESOURCE + course_id, done);
  });// ./it

  it('Should Delete the Course', function(done){
    _delete(URL, BASE_RESOURCE + course_id, done);
  });// ./it

  it('should the course be gone (no data) after delete', function(done){
    _gone(URL, BASE_RESOURCE + course_id, done)
  });// ./it

}); // ./describe