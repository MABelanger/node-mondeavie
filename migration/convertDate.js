var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

require('../schemas/embed/course.js')();
require('../schemas/embed/course2.js')();
var Course = mongoose.model('Course');
var Course2 = mongoose.model('Course2');


function getNewIsoDate(day, hour){
  // format 1999-11-04T14:51:06.157Z
  return new Date(day + 'T' + hour + '.000Z');
}


function setScheduleDay(schedule){
  var day = schedule.dayStart;
  var hour = schedule.hourStart;
  schedule.dayStart = getNewIsoDate(day, hour);

  day = schedule.dayEnd;
  hour = schedule.hourEnd;
  schedule.dayEnd = getNewIsoDate(day, hour);
}



mongoose.connect('mongodb://localhost/mondeavie-embed-urlid', function(err) {
  // if we failed to connect, abort
  if (err) throw err;
  console.log('connected');

  Course.find({}, function(err, courses){
    courses.map(function(course){
      course.teachers.map(function(teacher){
        if(teacher.course.courseTypes){
          teacher.course.courseTypes.map(function(courseType){
            if(courseType.schedules){
              courseType.schedules.map(function(schedule, indexSchedule){
                setScheduleDay(courseType.schedules[indexSchedule]);
                if(schedule.testingDays){
                  schedule.testingDays.map(function(testingDay, index){
                    schedule.testingDays[index] = getNewIsoDate(testingDay, "00:00");
                  });
                }
              });
            }
          });
        }
      });
      console.log('course.name', course.name);
      course2 = new Course2(course.toJSON());
      course2.save(function(err, obj){
        //console.log('obj', obj.name);
      });
    }); // courses.map
  });
});