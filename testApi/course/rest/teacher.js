"use strict";

// node ../node_modules/mocha/bin/mocha course.js 

var should = require('should');
var chai = require('chai').should;
var request = require('supertest');  


module.exports = function () {

  // Create
  var FIRST_NAME = 'First';
  var LAST_NAME = 'Last';
  var SLUG = 'first-last';

  // Update
  var FIRST_NAME_UPDATE = 'FirstUpdate';

  var functions = {};

  functions.createError = function(url, resource, done, cb){

    var bodyPost = {

    };

    request(url)
      .post(resource)
      .send(bodyPost)
      .set('Connection', 'keep-alive')
      .expect('Content-Type', /json/)
      .expect(400) //Status code
      .end(function(err,res) {
        res.body.errors['teachers.1.firstName'].message
          .should.equal( 'Le prénom est requis' );

        res.body.errors['teachers.1.lastName'].message
          .should.equal( 'Le nom est requis' );
        done();
      });// ./end
  };

  functions.create = function(url, resource, done, cb){

    var bodyPost = {
      "firstName": FIRST_NAME,
      "lastName": LAST_NAME
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
        res.body.firstName.should.equal( FIRST_NAME );
        res.body.lastName.should.equal( LAST_NAME );
        res.body.slug.should.equal( SLUG );
        let teacher_id = res.body._id;
        cb(teacher_id);
        done();
      });// ./end
  };

  functions.read = function(url, resource, done){
    request(url)
      .get(resource)
      .end(function (err,res) {
        res.body.firstName.should.equal( FIRST_NAME );
        done();
      });// ./end
  }

  functions.update = function(url, resource, done){
    var bodyPut = {
      "firstName": FIRST_NAME_UPDATE
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
        res.body.firstName.should.equal( FIRST_NAME_UPDATE );
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
        // hack to check if the res.body is null with should
        if (res.body == null) {
          res.body = 'null';
        }
        res.body.should.equal('null');
        done();
      });// ./end
  }
  return functions;
}