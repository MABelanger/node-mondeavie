// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('../../utils/utils');

var testingDaysSchema = new Schema({
  "slug" : String,
  "day": Date,
  "isFull": Boolean
});

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
  "image": {
    url: String
  },
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


// Hook on save method that create the slugs
CourseSchemaEmbed.pre('save', function(next) {
  // set the slugs value of course document and subDocuments
  console.log('pre save');
  utils.slugify(this);
  next();
});

// create an export function to encapsulate the model creation
module.exports = mongoose.model('Course', CourseSchemaEmbed);




