var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

require('../schemas/embed/courseEmbed.js')();
var Course = mongoose.model('Course');


function errHandle(err){
  console.log('err', err);
}

mongoose.connect('mongodb://localhost/mondeavie-embed-urlid', function(err) {
  // if we failed to connect, abort
  if (err) throw err;

  // find course by slug
  Course
  .find({'slug' : 'yoga'})
  .exec(function(err, courses) {
    if (err) return errHandle(err);
    console.log( JSON.stringify(courses[0].name) );
  });

/*
  Course
  .findOne({'teachers.firstName' : 'Isabelle'}, {"teachers.$" : 1})
  .exec(function(err, course) {
    if (err) return errHandle(err);
    console.log( JSON.stringify(course) );
  });
*/
});