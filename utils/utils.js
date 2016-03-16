var slug = require('slug');

function _clone(obj){
  return JSON.parse( JSON.stringify(obj) );
}

function getTeacherCoursesSlug(teacher){
  if(teacher.course) {
    var _slug = slug(teacher.course.courseType).toLowerCase();
    teacher.course.slug = _slug;
  }
  return teacher;
}

function teacherSlug(teachers){
  if (teachers){
    teachers.map(function(teacher, index){
      var _slug = slug(teacher.firstName + ' ' + teacher.lastName).toLowerCase();
      teachers[ index ].slug = _slug;
      teachers[ index ] = getTeacherCoursesSlug(teachers[ index ]);
    });
  }
}


function getYYYYMMDD(date){
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = date.getDate().toString();
  return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
}

var Utils = {
  slugify : function(course){
    // course slug is course.name
    if(course.name){
      course.slug = slug(course.name).toLowerCase();
    }
    // slug all teachers
    teacherSlug(course.teachers);
    return course;
  },
  getYYYYMMDD: getYYYYMMDD
}

module.exports = Utils;
