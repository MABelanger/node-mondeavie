var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require('lodash');

var Course = require('../schemas/embed/course2');
// Constants
var URL = 'mongodb://localhost/mondeavie-embed-urlid';


// Parse the body into Obj
app.use(bodyParser.json());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

// connect to monbodb
mongoose.connect(URL, function(err){
  if (err) throw err;
});

app.get('/', function(req, res){
  res.send('use /api');
});

function isValidId(id){
  return mongoose.Types.ObjectId.isValid(id);
}

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

// Delete Course
app.delete('/api/courses/:_id', function(req, res){
  if(isValidId(req.params._id)) {
    Course.delete(req.params._id, function(err){
      if( err ) throw err;
      res.json({
        'status': 'deleted',
        '_id' : req.params._id
      });
    });
  }else{
    res.json({
      'status': 'ERROR: id invalid',
    });
  }
});

// List Courses
app.get('/api/courses', function(req, res){
  Course.list(function(err, courses){
    if( err ) throw err;
    res.json(courses);
  });
});

app.listen(3000);
console.log('Running on port 3000');