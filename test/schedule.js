"use strict";

var should = require('should');
var chai = require('chai').should;
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
var winston = require('winston');

//var config = require('./config-debug');

describe('Routing', function() {
  var url = 'http://localhost:3000';
  var BASE_PATH = '/api/courses/56f1f7cae96dfe920145e0ec/teachers/56f1f7d3e96dfe920145e0ed/course_description/course_types/56fbddcf6b8cc7ba53415efa/schedules';
  var schedule_id = null;
  // within before() you can run all the operations that are needed to setup your tests. In this case
  // I want to create a connection with the database, and when I'm done, I call done().
  before(function(done) {
    // In our tests we use the test db
    //mongoose.connect(config.db.mongodb);              
    done();
  });
  // use describe to give a title to your test suite, in this case the tile is "Account"
  // and then specify a function in which we are going to declare all the tests
  // we want to run. Each test starts with the function it() and as a first argument 
  // we have to provide a meaningful title for it, whereas as the second argument we
  // specify a function that takes a single parameter, "done", that we will use 
  // to specify when our test is completed, and that's what makes easy
  // to perform async test!

  it('should Create a Schedule correctly', function(done){
    var bodyPost = {
      "isFull": false,
      "dayEnd": "2016-04-01T00:00:00.000Z",
      "dayStart": "2016-03-04T00:00:00.000Z",
      "dayName": "vendredi"
    };

    request(url)
      .post(BASE_PATH)
      .send(bodyPost)
      .set('Connection', 'keep-alive')
      .expect('Content-Type', /json/)
      .expect(200) //Status code
      .end(function(err,res) {
        if (err) {
          throw err;
        }
        // Should.js fluent syntax applied
        res.body.should.have.property('_id');
        schedule_id = res.body._id;
        res.body.dayName.should.equal('vendredi');
        done();
      });// ./end
  });// ./it

  /**
   * Read list
   */
  it('should get a list of schedule', function(done){
    request(url)
      .get(BASE_PATH)
      .end(function (err,res) {
        res.body[0].should.have.property('_id')
        done();
      });// ./end
  });// ./it

  /**
   * Update
   */
  it('should Update a Schedule correctly with the right'
     + 'slug and keep existing data', function(done){

    var bodyPut = {
      "dayName": "mardi"
    };

    request(url)
      .put(BASE_PATH + '/' + schedule_id)
      .send(bodyPut)
      .expect('Content-Type', /json/)
      .expect(200) //Status code
      .end(function(err,res) {
        if (err) {
          throw err;
        }
        // Should.js fluent syntax applied
        res.body.dayName.should.equal('mardi'); 
        done();
      });// ./end
  });// ./it

  /**
   * Delete
   */
  it('Should Delete the Schedule', function(done){

    request(url)
      .del(BASE_PATH + '/' + schedule_id)
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
  });// ./it

  /**
   * Read
   */
  it('should get no data after delete the Schedule', function(done){
    request(url)
      .get(BASE_PATH + '/' + schedule_id)
      .end(function (err,res) {
        // hack to check if the res.body is null with should
        if (res.body == null) {
          res.body = 'null';
        }
        res.body.should.equal('null');
        done();
      });// ./end
  });// ./it

}); // ./describe