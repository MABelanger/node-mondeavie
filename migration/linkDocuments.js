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


/**
 * Connect to the console database on localhost with
 * the default port (27017)
 */

/*
mongoose.connect('mongodb://localhost/mavn', function(err) {
  // if we failed to connect, abort
  if (err) throw err;

  // we connected ok
  //createData();
});
*/

mongoose.connect('mongodb://localhost/mondeavie', function(err) {
  // if we failed to connect, abort
  if (err) throw err;

  // we connected ok
  //findTree();
  findRecursive();
});

/**
 * Data generation
 */


function createCourse(teacher, courseName) {
  Course.create({
    id: "1",
    teacherId:"1",
    teacher: teacher,
    courseName: courseName,
    courseType: "yoga yogaDoux",
    note: "une note",
    image: "http://image",
    description: "une description",
    price: "50$",
    isVisible: true
  },
  function(err) {
    if (err) return done(err);
    find();
  });
}


function createCourseName(teacher) {
  CourseName.create(
    {
      id: "1",
      name: "Yoga",
      icon: "http://yoga"
    },
    function(err, courseName) {
      if (err) return done(err);
      createCourse(teacher, courseName)
    });
}


function createTeacher() {
  Teacher.create(
    {
      id: "1",
      firstName: "Alexandre",
      lastName: "Belanger",
      tel: "450 964 2586",
      schoolName: "Hebert",
      schoolUrl: "google.ca"
    },
    function(err, teacher) {
      if (err) return done(err);
      createCourseName(teacher)
    });

}
function createData() {
  createTeacher();
}

/**
 * Population
 */

function find() {
  Course
  .findOne({id: "1"})
  .populate('teacher')
  .populate('courseName')
  .exec(function(err, course) {
    if (err) return done(err);
    console.log(course);
    done();
  });
}

/**
 * find Recursive
 */

function findRecursive() {
  TestingDay
  .findOne({})
  .populate('daySchedule')
  .populate('schedule')
  .exec(function(err, testingDays) {
    if (err) return done(err);
    console.log(testingDays);
  });
}


function getObjectId(objects, id) {
  var objectId = 0;
  objects.map(function(obj) {
    if( obj.id == id) {
      objectId = obj._id;
    }
  });
  //return new ObjectId(objectId);
  return objectId;
}

function getDayName(id) {
  var dayName = '';
  switch (id) {
    case 1 : dayName = 'lundi'; break;
    case 2 : dayName = 'mardi'; break;
    case 3 : dayName = 'mercredi'; break;
    case 4 : dayName = 'jeudi'; break;
    case 5 : dayName = 'vendredi'; break;
    case 6 : dayName = 'samedi'; break;
    case 7 : dayName = 'dimanche'; break;
  };
  return dayName;
}

function findTree() {
  // {_id: '56d67dbe15288675475505c3'}
  Teacher
  .find( {} )
  .exec(function(err, teachers) {
    if (err) console.log("error" + err);
    teachers.map(function(teacher) {
      console.log('teacher : ' + teacher.id);
    });

    CourseName
    .find( {} )
    .exec(function(err, courseNames) {
      courseNames.map(function(courseName) {
        console.log('courseName : ' + courseName.id)
      });

      Course
      .find( {} )
      .exec(function(err, courses) {
        courses.map(function(course) {
          console.log('course.id : ' + course.id);
          course.teacher = getObjectId(teachers, course.teacherId);
          course.courseName = getObjectId(courseNames, course.courseNameId);
          //course.save();
        });

        Schedule
        .find( {} )
        .exec(function(err, schedules) {
          schedules.map(function(schedule) {
            console.log('schedule.id : ' + schedule.id);
            schedule.course = getObjectId(courses, schedule.courseId);
            //schedule.save();
          });

          DaySchedule
          .find( {} )
          .exec(function(err, daySchedules) {
            daySchedules.map(function(daySchedule) {
              console.log('daySchedule.id : ' + daySchedule.id);
              daySchedule.schedule = getObjectId(schedules, daySchedule.scheduleId);
              daySchedule.dayName = getDayName(daySchedule.dayNameId);
              //daySchedule.save();
            });

            TestingDay
            .find( {} )
            .exec(function(err, testingDays) {
              testingDays.map(function(testingDay) {
                console.log('testingDay.id : ' + testingDay.id);
                testingDay.daySchedule = getObjectId(daySchedules, testingDay.dayScheduleId);
                //testingDay.save();
              });
            }); // TestingDay
          }); // DaySchedule
        }); // Schedule
      }); // Course
    }); // CourseName
  }); // Teacher
}

function done(err) {
  if (err) console.error(err);
  Teacher.remove(function() {
    Course.remove(function() {
      mongoose.disconnect();
    });
  });
}
