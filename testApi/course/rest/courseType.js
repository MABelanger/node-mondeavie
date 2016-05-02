"use strict";

// node ../node_modules/mocha/bin/mocha course.js 

var should = require('should');
var chai = require('chai').should;
var request = require('supertest');  


module.exports = function () {

  // Create
  var NAME = 'a name'
  var SLUG = 'a-name';

  // Update
  var NAME_UPDATE = 'FirstUpdate';

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
        done();
      });// ./end
  };

  functions.create = function(url, resource, done, cb){
    var bodyPost = {
      "name": NAME
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

        let courseType_id = res.body._id;
        cb(courseType_id);
        done();
      });// ./end
  };

  functions.read = function(url, resource, done){
    request(url)
      .get(resource)
      .end(function (err,res) {
        res.body.name.should.equal( NAME );
        done();
      });// ./end
  }

  functions.update = function(url, resource, done){
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
        res.body.name.should.equal( NAME_UPDATE );
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