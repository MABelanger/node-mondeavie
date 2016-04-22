"use strict";

var should                 = require('should');

var restCourse             = require('./rest/course')();
var restTeacher            = require('./rest/teacher')();
var restCourseDescription  = require('./rest/courseDescription')();
var restCourseType         = require('./rest/courseType')();
var restSchedule           = require('./rest/schedule')();
var restTestingDay         = require('./rest/testingDay')();


var URL = 'http://localhost:3000';
var resource_course = '/api/courses/';
var resource_teacher = null;
var resource_courseDescription = null;
var resource_courseType = null;
var resource_schedule = null;
var resource_testingDay = null;

var course_id = null;
var teacher_id = null;
var courseType_id = null;
var schedule_id = null;
var testingDay_id = null;

// Course
describe('Create, Read, Update Course', function() {

  it('Should Create with error the Course', function(done){
    restCourse.createError(URL, resource_course, done);
  });// ./it

  before(function(done) {
    restCourse.create(URL, resource_course, done, function(_course_id){
      course_id = _course_id;
      resource_teacher = '/api/courses/' + _course_id + '/teachers/';
    });
  });

  it('Should Read the Course', function(done){
    restCourse.read(URL, resource_course + course_id, done);
  });// ./it

  it('Should Update a Course correctly with the right slug and keep existing data', function(done){
    restCourse.update(URL, resource_course + course_id, done);
  });// ./it

}); // ./describe


// Teacher
describe('Create, Read, Update Teacher', function() {

  it('Should Create with error the Teacher', function(done){
    restTeacher.createError(URL, resource_teacher, done);
  });// ./it

  before(function(done) {
    restTeacher.create(URL, resource_teacher, done, function(_teacher_id){
      teacher_id = _teacher_id;

      resource_courseDescription = '/api/courses/' + course_id 
                            + '/teachers/' + teacher_id
                            + '/course_description/';

    }); 
  });

  it('Should Read the Teacher', function(done){
    restTeacher.read(URL, resource_teacher + teacher_id, done);
  });// ./it

  it('Should Update a Teacher', function(done){
    restTeacher.update(URL, resource_teacher + teacher_id, done);
  });// ./it

}); // ./describe


// course description
describe('Create, Read, Update CourseDescription', function() {

  it('Should Create with error the CourseDescription', function(done){
    restCourseDescription.createError(URL, resource_courseDescription, done);
  });// ./it

  before(function(done) {
    restCourseDescription.create(URL, resource_courseDescription, done, function(){
      resource_courseType = '/api/courses/' + course_id 
                            + '/teachers/' + teacher_id
                            + '/course_description/course_types/';
    });
  });

  it('Should Read the CourseDescription', function(done){
    restCourseDescription.read(URL, resource_courseDescription, done);
  });// ./it

  it('Should Update a CourseDescription', function(done){
    restCourseDescription.update(URL, resource_courseDescription, done);
  });// ./it

}); // ./describe

// CourseType
describe('Create, Read, Update CourseType', function() {

  it('Should Create with error the CourseType', function(done){
    restCourseType.createError(URL, resource_courseType, done);
  });// ./it

  before(function(done) {
    //resource_courseType = '/api/courses/57145deba174745e29042cd0/teachers/56da1207dc80b7ca7805ea7b/course_description/course_types/';
    restCourseType.create(URL, resource_courseType, done, function(_courseType_id){
      courseType_id = _courseType_id;
      resource_schedule = '/api/courses/' + course_id 
                            + '/teachers/' + teacher_id
                            + '/course_description/course_types/' + courseType_id
                            + '/schedules/';
    });
  });

  it('Should Read the CourseType', function(done){
    restCourseType.read(URL, resource_courseType + courseType_id, done);
  });// ./it

  it('Should Update a CourseType', function(done){
    restCourseType.update(URL, resource_courseType + courseType_id, done);
  });// ./it

}); // ./describe


// Schedule
describe('Create, Read, Update Schedule', function() {

  it('Should Create with error the Schedule', function(done){
    restSchedule.createError(URL, resource_schedule, done);
  });// ./it

  before(function(done) {
    //resource_schedule = '/api/courses/57145deba174745e29042cd0/teachers/56da1207dc80b7ca7805ea7b/course_description/course_types/';
    restSchedule.create(URL, resource_schedule, done, function(_schedule_id){
      schedule_id = _schedule_id;
      resource_testingDay =   '/api/courses/' + course_id 
                            + '/teachers/' + teacher_id
                            + '/course_description/course_types/' + courseType_id
                            + '/schedules/' + schedule_id
                            + '/testing_days/';
    });
  });

  it('Should Read the Schedule', function(done){
    restSchedule.read(URL, resource_schedule + schedule_id, done);
  });// ./it

  it('Should Update a Schedule', function(done){
    restSchedule.update(URL, resource_schedule + schedule_id, done);
  });// ./it

}); // ./describe

// TestingDay
describe('Create, Read, Update TestingDay', function() {

  it('Should Create with error the TestingDay', function(done){
    restTestingDay.createError(URL, resource_testingDay, done);
  });// ./it

  before(function(done) {
    console.log('resource_testingDay', resource_testingDay);
    restTestingDay.create(URL, resource_testingDay, done, function(_testingDay_id){
      testingDay_id = _testingDay_id;

    });
  });

  it('Should Read the TestingDay', function(done){
    restTestingDay.read(URL, resource_testingDay + testingDay_id, done);
  });// ./it

  it('Should Update a TestingDay', function(done){
    restTestingDay.update(URL, resource_testingDay + testingDay_id, done);
  });// ./it

}); // ./describe


describe('Delete All', function() {

  before(function(done) {
    done();
  });

  // TestingDay
  it('Should Delete the TestingDay', function(done){
    restTestingDay.delete(URL, resource_testingDay + testingDay_id, done);
  });// ./it

  it('Should Read (no data) after delete TestingDay', function(done){
    restCourseType.gone(URL, resource_testingDay + testingDay_id, done)
  });// ./it


  // Schedule
  it('Should Delete the Schedule', function(done){
    restSchedule.delete(URL, resource_schedule + schedule_id, done);
  });// ./it

  it('Should Read (no data) after delete Schedule', function(done){
    restCourseType.gone(URL, resource_schedule + schedule_id, done)
  });// ./it


  // CourseType
  it('Should Delete the CourseType', function(done){
    restCourseType.delete(URL, resource_courseType + courseType_id, done);
  });// ./it

  it('Should Read (no data) after delete CourseType', function(done){
    restCourseType.gone(URL, resource_courseType + courseType_id, done)
  });// ./it


  // CourseDescription
  it('Should Delete the CourseDescription', function(done){
    restCourseDescription.delete(URL, resource_courseDescription, done);
  });// ./it

  it('Should Read (no data) after delete CourseDescription', function(done){
    restCourseDescription.gone(URL, resource_courseDescription, done)
  });// ./it


  // Teacher
  it('Should Delete the Teacher', function(done){
    restTeacher.delete(URL, resource_teacher + teacher_id, done);
  });// ./it

  it('Should Read (no data) after delete Teacher', function(done){
    restTeacher.gone(URL, resource_teacher + teacher_id, done)
  });// ./it


  // Course
  it('Should Delete the Course', function(done){
    restCourse.delete(URL, resource_course + course_id, done);
  });// ./it

  it('Should Read (no data) after delete Course', function(done){
    restCourse.gone(URL, resource_course + course_id, done)
  });// ./it

}); // ./describe