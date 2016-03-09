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


// Get All courses
app.get('/api/courses', function(req, res){
  Course.getCourses(function(err, courses){
    if( err ) throw err;
    res.json(courses);
  });
});

// create new course
app.post('/api/courses', function(req, res){
  var _course = req.body;
  Course.addCourse(_course, function(err, course){
    if( err ) throw err;
    res.json(course);
  });
});


app.get('/api/courses/:_slug', function(req, res){
  Course.getCourseBySlug(req.params._slug, function(err, course){
    if( err ) throw err;
    res.json(course);
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

/*
function updateSet(id, resource, resourceId, req, res) {
var set = {};
for (var field in partialUpdate) {
  set['subDocs.$.' + field] = partialUpdate[field];
}
Parent.update({_id: parentDoc._id, "subDocs._id": document._id}, 
    {$set: set}, 
    function(err, numAffected) {});
}
*/

app.put('/api/courses/:id/:resource/:resourceId', function(req, res) {
    // this method is only for Array of resources.
    var id = eq.params.id;
    var resource = req.params.resource;
    var resourceId = req.params.resourceId;

    updateSet(id, resource, resourceId, req, res);
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