"use strict";

var should                      = require('should');

var restConference              = require('./rest/conference')();
var restSchedule                = require('./rest/schedule')();


var URL = 'http://localhost:9000';
var resource_conference = '/api/conferences/';
var resource_schedule = null;

var conference_id = null;
var schedule_id = null;


// Conference
describe('Create, Read, Update Conference', function() {

  it('Should Create with error the Conference', function(done){
    restConference.createError(URL, resource_conference, done);
  });// ./it

  before(function(done) {
    restConference.create(URL, resource_conference, done, function(_conference_id){
      conference_id = _conference_id;
      resource_schedule = resource_conference + _conference_id + '/schedules/';
    });
  });

  it('Should Read the Conference', function(done){
    restConference.read(URL, resource_conference + conference_id, done);
  });// ./it

  it('Should Update a Conference correctly with the right slug and keep existing data', function(done){
    restConference.update(URL, resource_conference + conference_id, done);
  });// ./it

}); // ./describe


// Schedule
describe('Create, Read, Update Schedule', function() {

  it('Should Create with error the Schedule', function(done){
    restSchedule.createError(URL, resource_schedule, done);
  });// ./it

  before(function(done) {
    restSchedule.create(URL, resource_schedule, done, function(_schedule_id){
      schedule_id = _schedule_id;
    }); 
  });

  it('Should Read the Schedule', function(done){
    restSchedule.read(URL, resource_schedule + schedule_id, done);
  });// ./it

  it('Should Update a Schedule', function(done){
    restSchedule.update(URL, resource_schedule + schedule_id, done);
  });// ./it

}); // ./describe


describe('Delete All', function() {

  before(function(done) {
    done();
  });

  // Schedule
  it('Should Delete the Schedule', function(done){
    restSchedule.delete(URL, resource_schedule + schedule_id, done);
  });// ./it

  it('Should Read (no data) after delete Schedule', function(done){
    restSchedule.gone(URL, resource_schedule + schedule_id, done)
  });// ./it


  // Conference
  it('Should Delete the Conference', function(done){
    restConference.delete(URL, resource_conference + conference_id, done);
  });// ./it

  it('Should Read (no data) after delete Conference', function(done){
    restConference.gone(URL, resource_conference + conference_id, done)
  });// ./it

}); // ./describe