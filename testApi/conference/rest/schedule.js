"use strict";

// node ../node_modules/mocha/bin/mocha course.js 

var should = require('should');
var chai = require('chai').should;
var request = require('supertest');  


module.exports = function () {

  // Create
  var DAY_START = "2016-04-20T14:01:00.000Z";
  var DAY_END   = "2016-04-22T00:01:00.000Z";

  // Update
  var DAY_START_UPDATE = '2016-04-21T14:01:00.000Z';

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
      "dayStart": DAY_START,
      "dayEnd": DAY_END
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

        console.log('res.body', res.body)

        res.body.should.have.property('_id');
        res.body.dayStart.should.equal( DAY_START );
        res.body.dayEnd.should.equal( DAY_END );

        let schedule_id = res.body._id;
        cb(schedule_id);
        done();
      });// ./end
  };

  functions.read = function(url, resource, done){
    request(url)
      .get(resource)
      .end(function (err,res) {
        res.body.dayStart.should.equal( DAY_START );
        done();
      });// ./end
  }

  functions.update = function(url, resource, done){
    var bodyPut = {
      "dayStart": DAY_START_UPDATE
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
        res.body.dayStart.should.equal( DAY_START_UPDATE );
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