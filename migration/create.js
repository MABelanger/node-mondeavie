var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

require('./schemas/embed/courseEmbed.js')();
var Course = mongoose.model('Course');

var jsonData = require('./json/courses-db-svg.json');

mongoose.connect('mongodb://localhost/mondeavie-embed-urlid', function(err) {
  // if we failed to connect, abort
  if (err) throw err;
  jsonData.map(function(courseJson){
    Course.create(courseJson ,function(err, course) {
      if (err) return done(err);
      console.log(course);
    });
  });
});