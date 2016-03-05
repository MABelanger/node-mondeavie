var mongoose = require('mongoose');
var slug = require('slug');
var print = console.log.bind(console, '>')

var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

require('./schemas/embed/courseEmbed.js')();
var Course = mongoose.model('Course');


function errHandle(err){
  console.log('err', err);
}

function cbUpdateSlug (err, numAffected) {
  // numAffected is the number of updated documents
  console.log(numAffected);
}

function getTeacherCoursesSlug(teacher){
  if(teacher.course) {
    var _slug = slug(teacher.course.courseType).toLowerCase();
    teacher.course.slug = _slug;
  }
  return teacher;
}


function teacherSlug(course){
  var teachers = course.teachers;
  teachers.map(function(teacher, index){
    //course._id = course.name.toLowerCase();
    var _slug = slug(teacher.firstName + ' ' + teacher.lastName).toLowerCase();
    teachers[ index ].slug = _slug;
    teachers[ index ] = getTeacherCoursesSlug(teachers[ index ]);
  });

  var conditions = { '_id' : course._id }
    , update = { 'teachers' : teachers }
    , options = { multi: true };

  Course.update(conditions, update, options, cbUpdateSlug);
}

function courseSlug(courses){
  courses.map(function(course){
    //course._id = course.name.toLowerCase();
    var _slug = slug(course.name).toLowerCase();
    var conditions = { '_id' : course._id }
      , update = { 'slug' : _slug }
      , options = { multi: true };

    Course.update(conditions, update, options, cbUpdateSlug);

    teacherSlug(course);
  });
}

mongoose.connect('mongodb://localhost/mondeavie-embed-urlid', function(err) {
  // if we failed to connect, abort
  if (err) throw err;


  Course
  .find({})
  .exec(function(err, courses) {
    if (err) throw err;
    courseSlug(courses)
  });




});