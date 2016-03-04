var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

require('./schemas/embed/courseEmbed.js')();
var CourseEmbed = mongoose.model('CourseEmbed');

var jsonData = require('./json/courses-db-svg.json');

mongoose.connect('mongodb://localhost/bibi', function(err) {
  // if we failed to connect, abort
  if (err) throw err;
  jsonData.map(function(course){
    CourseEmbed.create(course ,function(err, courseEmbed) {
        if (err) return done(err);
        console.log(courseEmbed);
    });
  });
});



