var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

require('./schemas/teacher.js')();
var Teacher = mongoose.model('Teacher');

require('./schemas/courseName.js')();
var CourseName = mongoose.model('CourseName');

require('./schemas/course.js')();
var Course = mongoose.model('Course');

require('./schemas/schedule.js')();
var Schedule = mongoose.model('Schedule');

require('./schemas/daySchedule.js')();
var DaySchedule = mongoose.model('DaySchedule');

require('./schemas/testingDay.js')();
var TestingDay = mongoose.model('TestingDay');


mongoose.connect('mongodb://localhost/mondeavie', function(err) {
  // if we failed to connect, abort
  if (err) throw err;

  // we connected ok
  //findTree();
  findRecursive(function(jsonObj){
    console.log(JSON.stringify(jsonObj[0]));
  });
});

/**
 * find Recursive
 */

function findRecursive(cb) {
  var jsonObj = [];
  CourseName
  .find({})
  .exec(function(err, courseNames) {
    if (err) return done(err);
    courseNames.map(function(courseName, index) {
      jsonObj.push({
        name : courseName.name
      });

      Course
      .find({ courseName : courseName._id })
      .lean()
      .exec(function(err, courses) {
        jsonObj[ index ].courses = courses;
        if(courseNames.length -1 == index) {
          cb(jsonObj);
        }
      });
    });
  });
  
}