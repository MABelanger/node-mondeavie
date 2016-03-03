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
  var isTrue;
  teachers.map(function(teacher, index){
    isTrue = isTrue || String(teacher._id) == String(id);
  });
  return isTrue;
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

          daySchedules.map(function(daySchedule, indexDaySchedule){
            TestingDay
            .find({ daySchedule: daySchedule._id })
            .lean()
            .exec(function(err, testingDays){

              daySchedules[ indexDaySchedule ].testingDays = testingDays;
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
                      if( isTeacher(jsonObj[ index ].teachers, teacher._id) == true ) {
                        //console.log('++++do not insert\n\n\n', teacher);
                      } else {
                        teacher.course = course;
                        teacher.course.courseTypes = schedules;
                        jsonObj[ index ].teachers.push(teacher);
                        console.log("\n\n\n_____" + JSON.stringify(jsonObj));
                        //console.log('teacher.firstName', teacher.firstName)
                      }
                    }
                  }); // jsonObj.map
                }); // CourseName
              }); // Teacher
            }); // TestingDay
          }); // daySchedules.map
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


