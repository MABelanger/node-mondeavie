var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require('lodash');


app.use(bodyParser.json());

var Course = require('../schemas/embed/course');

var URL = 'mongodb://localhost/mondeavie-embed-urlid';
// connect to monbodb
mongoose.connect(URL, function(err){
  if (err) throw err;
});

app.get('/', function(req, res){
  res.send('use /api');
});



/* 
 * /app/courses/:courseId/teachers/:teacherId/course/courseTypes/:courseTypesId/schedules/:schedulesId/testingDays/:testingDaysId
 */


/* 
 * CRUD operations for the course
 */

// Create course
app.post('/api/courses', function(req, res){
  var course = req.body;
  Course.create(course, function(err, createdCourse){
    if( err ) throw err;
    res.json( createdCourse );
  });
});

// Read Course
app.get('/api/courses/:_id', function(req, res){
  Course.read(req.params._id, function(err, course){
    if( err ) throw err;
    res.json(course);
  });
});

// Update Course
app.put('/api/courses/:_id', function(req, res){
  var id =  req.params._id;
  var course = req.body;
  Course.update(id, course, function(err, updatedCourse){
    if( err ) throw err;
    res.json( updatedCourse );
  });
});


// List Courses
app.get('/api/courses', function(req, res){
  Course.list(function(err, courses){
    if( err ) throw err;
    res.json(courses);
  });
});











app.put('/api/courses/:_slug', function(req, res){
  var slug =  req.params._slug;
  var _course = req.body;
  Course.updateBySlug(slug, _course, {}, function(err, course){
    if( err ) throw err;
    res.json(course);
  });
});





app.get('/test', function(req, res) {
  Course.findOne({'_id' : '56df6f349e9a0e869f9ba190' }, function(err, course){
    console.log('course', course)
    /*
    course.teachers[0].firstName = 'bibi6';
    course.teachers[0].course = {
        slug : "qi-gong",
        courseType : "Qi Gong",
        "courseTypes" : [{
          "name" : "Qi Gong Céline Gagné"
        }]
    };
    */

    /*
    var newSchedule = [
        {
          "isFull" : false,
          "hourStart" : "15:00:00",
          "hourEnd" : "16:30:00",
          "dayEnd" : "2016-05-31",
          "dayStart" : "2016-01-12",
          "dayName" : "mardi",
          "testingDays" : [
            {
              "day" : "2016-01-13",
              "isFull" : false,
            }
          ]
        }
      ];
    */

    var newTestingDay = {
              "day2" : "2050-01-13",
              "isFull" : false,
              "_id":"56dfa5acb1ee3eaca339bdb2"
    };
    var bigObj = course.teachers.id('56df6f349e9a0e869f9ba191').course.courseTypes
    .id('56df9b4ff4e198d9a275a179')
    .schedules.id('56dfa5acb1ee3eaca339bdb1')
    .testingDays.id('56dfa5acb1ee3eaca339bdb2');

    for (var field in newTestingDay) {
      bigObj[ field ] = newTestingDay[ field ];
    }

    //course.markModified('teachers.course.courseTypes.name');
    course.save(function (err) {
      if (err) console.log(err);
      console.log('Success!');
      res.json(course);
    });
  }); // find
});


app.listen(3000);
console.log('Running on port 3000');