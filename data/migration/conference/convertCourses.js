"use strict";
var _ = require('lodash');
var moment = require('moment');
var Request     = require("superagent");
var json = require('./course10.json');

          
/*
 * Free Days
 */


function getTestingDaysList(testingDays){
  // let testingDays = {
  //   list: {
  //     5: {
  //       list: [
  //         "05 mai 2016",
  //         "06 mai 2016"
  //       ],
  //       monthName: "Mai 2016"
  //     }
  //   }
  // }

  // {"list":{"5":{"list":["05 mai 2016","06 mai 2016"],"monthName":"Mai 2016"}}}
  json = JSON.stringify(testingDays);

  // get only string between []
  let listStr = json.substring(json.lastIndexOf("[")+1,json.lastIndexOf("]"));
  // put the []
  listStr = "[" + listStr + "]"

  // return the array
  return JSON.parse(listStr);
}






function getFreeDay(json){
  let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

  let strDate = json + " " + "00:00";

  //let mDate = moment('5 mai 2016 09:30', 'DD MMM YYYY HH:mm', 'fr');
  let mDate = moment(strDate, 'DD MMM YYYY HH:mm', 'fr');


  let noOffset = moment(mDate - tzoffset).utcOffset(0);

  return {
    day : noOffset.toISOString(),
    isFull: false
  }
}


function addFreeDay(freeDays, json){

  // remove the junk, get only the list between []
  json = getTestingDaysList(json);

  //console.log('____json', json)
  for(let i=0; i<json.length; i++){
    let freeDay = _.find(freeDays, function(freeDay) {
      return freeDay.day == getFreeDay(json[i]).day; 
    });

    if(!freeDay){
      freeDay = getFreeDay(json[i]);
      freeDays.push(freeDay);
    }
  }
}


/*
 * Schedule
 */

function getSchedule(json){
  let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

  let strDateStart = json.day_start + " " + json.hour_start;
  let strDateEnd = json.day_end + " " + json.hour_end;

  //let mDate = moment('5 mai 2016 09:30', 'DD MMM YYYY HH:mm', 'fr');
  let mDateStart = moment(strDateStart, 'YYYY-MM-DD HH:mm', 'fr');
  let mDateEnd = moment(strDateEnd, 'YYYY-MM-DD HH:mm', 'fr');

  let noOffsetStart = moment(mDateStart - tzoffset).utcOffset(0);
  let noOffsetEnd = moment(mDateEnd - tzoffset).utcOffset(0);

  return {
    dayStart : noOffsetStart.toISOString(),
    dayEnd : noOffsetEnd.toISOString(),
    isFull: json.is_full
  }
}


function addSchedule(schedules, json){


  //console.log('____json', json)
  for(let i=0; i<json.length; i++){
    let schedule = _.find(schedules, function(schedule) {
      return schedule.dayStart == getSchedule(json[i]).dayStart; 
    });

    if(!schedule){
      schedule = getSchedule(json[i]);
      schedule.freeDays = [];
      schedules.push(schedule);
    }

    addFreeDay(schedule.freeDays, json[i].testingDays);
  }
}


/*
 * Course Type
 */

function getCourseType(json){
  let courseType = { 
    name: null,
    description: null,
  };

  courseType.name = json.name;
  courseType.description = json.description;

  return courseType;
}

function addCourseType(courseTypes, json){


  for(let i=0; i<json.length; i++){
    let courseType = _.find(courseTypes, function(courseType) {
      return courseType.name == getCourseType(json[i]).name; 
    });

    if(!courseType){
      courseType = getCourseType(json[i]);
      courseType.schedules = [];
      courseTypes.push(courseType);
    }

    
    addSchedule(courseType.schedules, json[i].daySchedules)
  }

}

/*
 * Course Descriptioin
 */
function getCourseDescription(json){
  let courseDescription = { 
      courseType: null,
      note: null,
      price: null,
      isVisible: true,
      image: {
        url: null
      }
  };

  courseDescription.isVisible = json.is_visible;
  courseDescription.courseType = json.course_type;
  courseDescription.image.url = json.image;
  courseDescription.note = json.note;
  courseDescription.description = json.description
  courseDescription.price = json.price;
  

  return courseDescription;
}

function addCourseDescription(teacher, json){
  teacher.course = getCourseDescription(json);
  teacher.course.courseTypes = [];

  //console.log('json.schedules', json.schedules)
  addCourseType(teacher.course.courseTypes, json.schedules)
}


/*
 * Teacher
 */
function getTeacher(json){
  let teacher = { 
    firstName: null,
    lastName: null,
    tel: null,
    schoolName: null,
    schoolUrl: null
  };

  teacher.firstName = json.first_name;
  teacher.lastName = json.last_name;
  teacher.tel = json.tel;
  teacher.schoolName = json.school_name;
  teacher.schoolUrl = json.school_url;

  return teacher;
}

function addTeacher(teachers, json){
  let teacher = _.find(teachers, function(teacher) {
    return teacher.firstName == getTeacher(json.teacher).firstName; 
  });

  if(!teacher){
    teacher = getTeacher(json.teacher);
    addCourseDescription(teacher, json);
    teachers.push(teacher);
  }


}

/*
 * Course
 */
function getCourse(json){
  let course = { 
    name: null,
  };

  course.name = json.name;

  return course;
}

var courses = [];
function addCourse(json){
  let course = _.find(courses, function(course) {
    return course.name == getCourse(json.course_name).name; 
  });

  if(!course){
    course = getCourse(json.course_name);
    course.teachers = [];
    courses.push(course);
  }

  addTeacher(course.teachers, json);

  //console.log('course',  JSON.stringify(course))

}

function readUrl(url, cb) {
  Request
  .get(url, function(err, res){
    if(!err){
      cb(res.body);
    }
  });
}

for(let i=0; i<10; i++){
  let url = 'http://www.mondeavie.ca/calendar_activities/api/nested/childs/courses/'+ i + '?format=json';
  readUrl(url, function(json){
    addCourse(json);

    // convertConference(json, function(conference){
    //   console.log('conference._id', conference._id);
    // });
    if(i==9){
      endConvert()
    }
  });
}

function endConvert(){
  for(let i=0; i<courses.length; i++){
    console.log('courses[i]:', courses[i])
  }
}



