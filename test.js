
var should = require('should');
var chai = require('chai').should;
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
var winston = require('winston');

//var config = require('./config-debug');

describe('Routing', function() {
  var url = 'http://localhost:3000';
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

  /**
   * Create
   */

  it('should Create a Course Description correctly', function(done){
  	var bodyPost = {
      "slug": "",
      "courseType": "course Type",
      "note": "",
      "description": "",
      "price": "",
      "isVisible": true,
      "courseTypes": [
        {
          "name": "5 ateliers avec Marie-Andrée Beaumier",
          "description": "",
          "_id": "56da1207dc80b7ca7805ea7c",
          "schedules": [
            {
              "isFull": false,
              "dayEnd": "2016-04-01T00:00:00.000Z",
              "dayStart": "2016-03-04T00:00:00.000Z",
              "dayName": "vendredi",
              "_id": "56da1207dc80b7ca7805ea7d",
              "testingDays": []
            }
          ]
        }
      ]
  	};

  	request(url)
  		.post('/api/courses/56f1f7cae96dfe920145e0ec/teachers/56f8ce4a9474f74640335424/course_description')
  		.send(bodyPost)
  		.expect('Content-Type', /json/)
  		.expect(200) //Status code
  		.end(function(err,res) {
  			if (err) {
  				throw err;
  			}
  			// Should.js fluent syntax applied
  			// res.body.should.have.property('_id');
        res.body.courseType.should.equal('course Type');
        res.body.courseTypes[0].schedules[0].isFull.should.equal(false); 
        // res.body.creationDate.should.not.equal(null);
  			done();
  		});// ./end
  });// ./it


  /**
   * Read
   */
  it('should get no data', function(done){
    request(url)
      .get('/api/courses/56f1f7cae96dfe920145e0ec/teachers/56f8ce4a9474f74640335424/course_description')
      .end(function (err,res) {
        res.body.courseType.should.equal('course Type');
        res.body.courseTypes[0].schedules[0].isFull.should.equal(false); 
        done();
      });// ./end
  });// ./it

  /**
   * Update
   */
  it('should Update a Course Description correctly with the right'
     + 'slug and keep existing data', function(done){

    var bodyPut = {
      "slug": "",
      "courseType": "course Type 2",
    };

    request(url)
      .put('/api/courses/56f1f7cae96dfe920145e0ec/teachers/56f8ce4a9474f74640335424/course_description')
      .send(bodyPut)
      .expect('Content-Type', /json/)
      .expect(200) //Status code
      .end(function(err,res) {
        if (err) {
          throw err;
        }
        // Should.js fluent syntax applied
        // res.body.should.have.property('_id');
        res.body.courseType.should.equal('course Type 2'); 
        res.body.slug.should.equal('course-type-2');
        res.body.courseTypes[0].schedules[0].isFull.should.equal(false);                
        // res.body.creationDate.should.not.equal(null);
        done();
      });// ./end
  });// ./it

  /**
   * Delete
   */
  it('should Update a Course Description correctly with the right'
     + 'slug and keep existing data', function(done){

    request(url)
      .del('/api/courses/56f1f7cae96dfe920145e0ec/teachers/56f8ce4a9474f74640335424/course_description')
      .expect('Content-Type', /json/)
      .expect(200) //Status code
      .end(function(err,res) {
        if (err) {
          throw err;
        }
        // Should.js fluent syntax applied
        // res.body.should.have.property('_id');

        // res.body.creationDate.should.not.equal(null);
        done();
      });// ./end
  });// ./it

  /**
   * Read
   */
  it('should get no data', function(done){
    request(url)
      .get('/api/courses/56f1f7cae96dfe920145e0ec/teachers/56f8ce4a9474f74640335424/course_description')
      .end(function (err,res) {
        res.body.should.equal('');
        done();
      });// ./end
  });// ./it



}); // ./describe