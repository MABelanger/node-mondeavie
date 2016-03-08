var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


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



app.listen(3000);
console.log('Running on port 3000');