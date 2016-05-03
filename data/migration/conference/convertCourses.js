"use strict";
var _ = require('lodash');

var json = require('./course10.json');


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


  for(let i=0; i<json.length; i++){
    //console.log('json', json[0])
    let schedule = _.find(schedules, function(schedule) {
      return schedule.dayStart == getSchedule(json[i]).dayStart; 
    });

    if(!schedule){
      schedule = getSchedule(json[i]);
      schedules.push(schedule);
    }
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
    //console.log('json', json[0])
    let courseType = _.find(courseTypes, function(courseType) {
      return courseType.name == getCourseType(json[i]).name; 
    });

    if(!courseType){
      courseType = getCourseType(json[i]);
      courseTypes.push(courseType);
    }
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

let courses = [];
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

  console.log('course',  JSON.stringify(course))
}

addCourse(json);


/*{
    name: null,
    svg: null,
    slug: null,
    teachers: [
      {
        slug: null,
        firstName: null,
        lastName: null,
        tel: null,
        schoolName: null,
        schoolUrl: null,
        "course": {
          slug: null,
          courseType: null,
          note: null,
          price: null,
          isVisible: true,
          image: {
            url: "media/img/course_description/marie-andree-beaumier_medicinale.jpg"
          }
          courseTypes: [
            {
              name: null,
              description: null,
              _id: null,
              slug: null,
              schedules: [
                {
                  isFull: false,
                  dayEnd: null,
                  dayStart: null,
                  dayName: null,
                  freeDays: [
                    {
                      day: null,
                    }
                  ]
                }
              ]
            }
          ]
        },
      }
    ]
  }
}
*/



// for(let i=0; i<100; i++){
//   let url = 'http://www.mondeavie.ca/calendar_activities/api/nested/childs/conferences/'+ i + '?format=json';
//   readDayConference(url, function(json){
//     convertConference(json, function(conference){
//       console.log('conference._id', conference._id);
//     });
//   });
// }


