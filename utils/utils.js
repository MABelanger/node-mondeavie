var slug =                     require('slug');
var fs =                       require('fs');
var sharp =                    require('sharp');


function _clone(obj){
  return JSON.parse( JSON.stringify(obj) );
}

function getTeacherCoursesSlug(teacher) {
  if (teacher.course) {
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


function getYYYYMMDD(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = date.getDate().toString();
  return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
}

function slugify(course) {
  // course slug is course.name
  if (course.name) {
    course.slug = slug(course.name).toLowerCase();
  }
  // slug all teachers
  teacherSlug(course.teachers);
  return course;
}


function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

function saveImage(dataString, imgPath, callback) {
  var bitmap = decodeBase64Image(dataString).data;
  sharp(bitmap)
    .resize(200, 100)
    .max()
    .toFormat('jpeg')
    .toFile(imgPath, function(err) {
      console.log(err)
      callback(imgPath);
      // output.jpg is a 300 pixels wide and 200 pixels high image
      // containing a scaled and cropped version of input.jpg
    });
}

var Utils = {
  slugify : slugify,
  getYYYYMMDD: getYYYYMMDD,
  saveImage: saveImage
}

module.exports = Utils;
