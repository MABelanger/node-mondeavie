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
  findRecursive();
});


var jsonObj = [];
var _courseNames =[];
var _courseName;
var _teachers = [];
var _teacher;
var _courseNameIndex = 0;


function isTeacher(teachers, id) {
  //console.log('id', id)
  teachers.map(function(teacher, index){
    if(teacher._id == id) {
      return true;
    }
  });
  return false;
}




function cbCourse(err, course) {
  if(course) {

    Schedule
    .find({ course: course._id })
    .lean()
    .exec(function(err, schedules){
      schedules.map(function(schedule, indexSchedule){

        DaySchedule
        .find({ schedule: schedule._id })
        .lean()
        .exec(function(err, daySchedules){

          schedules[ indexSchedule ].schedules = daySchedules;
          //console.log('daySchedules', daySchedules)
          Teacher
          .findOne({ _id: course.teacher })
          .lean()
          .exec(function(err, teacher){

            CourseName
            .findOne({ _id: course.courseName })
            .lean()
            .exec(function(err, courseName){

              jsonObj.map(function(courseMap, index){
                if(courseName.name == courseMap.name){
                  //console.log('courseName.name', courseName.name)
                  if( isTeacher(jsonObj[ index ].teachers, teacher._id) ) {
                    console.log('++++do not insert', teacher);
                  } else {
                    teacher.courseTypes = schedules;
                    jsonObj[ index ].teachers.push(teacher);
                    console.log("\n\n\n");
                    console.log("_____" + JSON.stringify(jsonObj));
                  }
                }
              }); // jsonObj.map
            }); // CourseName
          }); // Teacher
        }); // DaySchedule
      }); // schedules.map
    }); // Schedule
  } // if(course)
}


function cbTeacher(err, teachers) {
  _courseNames.map(function(courseName) {
    _courseName = courseName;

    jsonObj.push({
      name : _courseName.name,
    });

    // for each course reset teachers
    jsonObj[ jsonObj.length -1 ].teachers = [];

    teachers.map(function(teacher) {
      Course
      .findOne({ courseName : _courseName._id, teacher: teacher._id })
      .lean()
      .exec(cbCourse);
    });
  });
}

function cbCourseName(err, courseNames) {
  if (err) return done(err);
  _courseNames = courseNames;
  Teacher
  .find({  })
  .lean()
  .exec(cbTeacher);

}


function findRecursive(cb) {
  CourseName
  .find({})
  .exec(cbCourseName);
}


