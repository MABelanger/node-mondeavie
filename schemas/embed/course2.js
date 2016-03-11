// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var utils = require('../../utils/utils');

var testingDaysSchema = new Schema({
  "slug" : String,
  "day": Date,
  "isFull": Boolean
});

/*
{
  toObject: {virtuals: true}, 
  toJSON: {virtuals: true}
});

testingDaysSchema.virtual('yyyymmdd').get(function () {
  return utils.getYYYYMMDD(this.day);
});
*/

var SchedulesSchema = new Schema({
  "slug" : String,
  "isFull": Boolean,
  "dayEnd": Date,
  "dayStart": Date,
  "dayName": String,
  "testingDays": [ testingDaysSchema ]
});

var courseTypesSchema = new Schema({
  "slug" : String,
  "name": String,
  "description": String,
  "schedules": [ SchedulesSchema ]
});

var CourseSchema = new Schema({
  "slug" : String,
  "courseType": String,
  "note": String,
  "image": String,
  "description": String,
  "price": String,
  "isVisible": Boolean,
  "courseTypes": [ courseTypesSchema ]
});

var TeachersSchema = new Schema({
  "slug" : String,
  "firstName": String,
  "lastName": String,
  "tel": String,
  "schoolName": String,
  "schoolUrl": String,
  "course": CourseSchema
});

var CourseSchemaEmbed = Schema({
  "slug" : String,
  "name" : String,
  "svg": String,
  "teachers" : [ TeachersSchema ]
}); // courseSchema

//CourseSchemaEmbed.set('versionKey', '3');


CourseSchemaEmbed.pre('save', function(next) {
  // set the slugs value of course document and subDocuments
  console.log('pre save');
  utils.slugify(this);
  next();
});


/**
 functions of the model Course
 **/

// create an export function to encapsulate the model creation
var Course = mongoose.model('Course2', CourseSchemaEmbed);

// create container functions



/* 
 * CRUD operations for the courses
 */

// Create Course
Course.create = function(json, callback) {
  course = new Course(json);
  course.save(callback);
}

// Read Course
Course.read = function(_id, callback) {
  Course.findById( _id, callback);
}

// Update Course
Course.update = function(_id, json, callback) {

  // we don't call update by id because the hook pre-update is not supported
  // so call save method instead.
  // Course.findByIdAndUpdate(_id, json, callback);

  Course.findById( _id, function(err, course){
    // copy all attributes from json to the course
    console.log('course', course)
    for (var attName in json) {
      course[attName] = json[attName];
    }
    course.save(callback);
  });
}

// Delete Course
Course.delete = function(_id, callback) {
  Course.findByIdAndRemove(_id, callback);
};

// List Courses
Course.list = function(callback) {
  Course.find({}, callback);
}



// Get Only one course by the name of the course ( slug )
Course.getCourseBySlug = function(slug, callback) {
  Course.findOne({ slug: slug }, callback);
}


module.exports = Course;

// /app/courses/:courseId/teachers/:teacherId/course/courseTypes/:courseTypesId/schedules/:schedulesId/testingDays/:testingDaysId

