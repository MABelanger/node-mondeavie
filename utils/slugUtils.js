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


var SlugUtils = {
  course : function(course){
    var courseSlug = _clone(course);
    var _slug = slug(courseSlug.name).toLowerCase();

    // course slug is course.name
    courseSlug.slug = _slug;
    // slug all teachers
    teacherSlug(courseSlug.teachers);
    return courseSlug;
  }
}

module.exports = SlugUtils;
