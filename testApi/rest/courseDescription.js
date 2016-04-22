"use strict";

// node ../node_modules/mocha/bin/mocha course.js 

var should = require('should');
var chai = require('chai').should;
var request = require('supertest');  


module.exports = function () {

  // Create
  var COURSE_TYPE = 'a courseType'
  var SLUG = 'a-courseType';

  // Update
  var COURSE_TYPE_UPDATE = 'FirstUpdate';

  var functions = {};

  functions.createError = function(url, resource, done, cb){

    var bodyPost = {

    };

    request(url)
      .put(resource)
      .send(bodyPost)
      .set('Connection', 'keep-alive')
      .expect('Content-Type', /json/)
      .expect(400) //Status code
      .end(function(err,res) {
        console.log('res.body.errors', res.body.errors)
        // res.body.errors['courseType.1.courseType'].message
        //   .should.equal( 'Le prénom est requis' );

        // res.body.errors['courseType.1.lastName'].message
        //   .should.equal( 'Le nom est requis' );
        done();
      });// ./end
  };

  functions.create = function(url, resource, done, cb){

    var bodyPost = {
      "courseType": COURSE_TYPE
    };


    request(url)
      .put(resource)
      .send(bodyPost)
      .set('Connection', 'keep-alive')
      //.expect('Content-Type', /json/)
      .expect(200) //Status code
      .end(function(err,res) {
        if (err) {
          throw err;
        }

        res.body.courseType.should.equal( COURSE_TYPE );

        cb();
        done();
      });// ./end
  };

  functions.read = function(url, resource, done){
    request(url)
      .get(resource)
      .end(function (err,res) {
        res.body.courseType.should.equal( COURSE_TYPE );
        done();
      });// ./end
  }

  functions.update = function(url, resource, done){
    var bodyPut = {
      "courseType": COURSE_TYPE_UPDATE
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
        res.body.courseType.should.equal( COURSE_TYPE_UPDATE );
        done();
      });// ./end
  }


  functions.delete = function(url, resource, done){
    request(url)
      .del(resource)
      .expect('Content-Type', /json/)
      .expect(200) //Status code
      .end(function(err,res) {
        if (err) {
          throw err;
        }
        res.body.status.should.equal('deleted');
        done();
      });// ./end
  }

  functions.gone = function(url, resource, done){
    request(url)
      .get(resource)
      .end(function (err,res) {
        res.body.should.equal('');
        done();
      });// ./end
  }
  return functions;
}