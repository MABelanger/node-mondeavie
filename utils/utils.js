"use strict";

var slug =                     require('slug');
var sharp =                    require('sharp');

function _getTeacherCoursesSlug(teacher) {
  if (teacher.course && teacher.course.courseType) {
    var _slug = slug(teacher.course.courseType).toLowerCase();
    teacher.course.slug = _slug;
  }
  return teacher;
}

function _teacherSlug(teachers){
  if (teachers){
    teachers.map(function(teacher, index){
      if( teacher.firstName && teacher.lastName ){
        var _slug = slug(teacher.firstName + ' ' + teacher.lastName).toLowerCase();
        teachers[ index ].slug = _slug;
        teachers[ index ] = _getTeacherCoursesSlug(teachers[ index ]);
      }
    });
  }
}

function _decodeBase64Image(dataString) {
  console.log('dataString', dataString)
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches && matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

function saveImage(dataString, imgPath, callback) {
  var bitmap = _decodeBase64Image(dataString).data;
  sharp(bitmap)
    .resize(200, 100)
    .max()
    .toFormat('jpeg')
    .toFile(imgPath, function(err) {
      callback(imgPath);
      // output.jpg is a 300 pixels wide and 200 pixels high image
      // containing a scaled and cropped version of input.jpg
    });
}

function slugifyCourse(course) {
  // course slug is course.name
  if (course.name) {
    course.slug = slug(course.name).toLowerCase();
  }
  // slug all teachers
  _teacherSlug(course.teachers);
  return course;
}

function getYYYYMMDD(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = date.getDate().toString();
  return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
}

function _slugifySpeaker(speaker) {
  // conference slug is conference.title
  var _slug = undefined;
  if (speaker && speaker.firstName && speaker.lastName) {
    speaker.slug = slug(speaker.firstName + ' ' + speaker.lastName).toLowerCase();
  }
  return speaker;
}

function slugifyConference(conference) {
  // conference slug is conference.title
  if (conference && conference.title) {
    conference.slug = slug(conference.title).toLowerCase();
    conference.speaker = _slugifySpeaker(conference.speaker)
  }
  return conference;
}




var Utils = {
  slugifyCourse : slugifyCourse,
  slugifyConference : slugifyConference,
  getYYYYMMDD: getYYYYMMDD,
  saveImage: saveImage
};

module.exports = Utils;
