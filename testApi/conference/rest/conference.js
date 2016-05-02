"use strict";

// run :. node ./node_modules/mocha/bin/mocha testApi/conference/api.js

var should = require('should');
var chai = require('chai').should;
var request = require('supertest');  


module.exports = function () {

  // Create
  var TITLE = 'TEST 5';
  var SLUG = 'test-5';

  // Update
  var TITLE_UPDATE = 'TEST 7';
  var SLUG_UPDATE = 'test-7';

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
        res.body.errors['title'].message
          .should.equal( 'Le titre est requis' );
        done();
      });// ./end
  };

  functions.create = function(url, resource, done, cb){

    var bodyPost = {
      "title": TITLE,
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
        res.body.title.should.equal( TITLE );
        res.body.slug.should.equal( SLUG );
        let conference_id = res.body._id;
        cb(conference_id);
        done();
      });// ./end
  };

  functions.read = function(url, resource, done){
    request(url)
      .get(resource)
      .end(function (err,res) {
        res.body.title.should.equal( TITLE );
        done();
      });// ./end
  }

  functions.update = function(url, resource, done){
    var bodyPut = {
      "title": TITLE_UPDATE
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
        res.body.title.should.equal( TITLE_UPDATE );
        res.body.slug.should.equal( SLUG_UPDATE );
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