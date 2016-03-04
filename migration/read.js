var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

require('./schemas/embed/courseEmbed.js')();
var Course = mongoose.model('Course');


function errHandle(err){
  console.log('err', err);
}

mongoose.connect('mongodb://localhost/mondeavie-embed', function(err) {
  // if we failed to connect, abort
  if (err) throw err;

  Course
  .find({'teachers.firstName' : 1}, {"teachers.$" : 1})
  .exec(function(err, teachers) {
    if (err) return errHandle(err);
    console.log( JSON.stringify(teachers) );
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