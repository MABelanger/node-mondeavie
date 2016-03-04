// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testingDaysSchema = new Schema({
  "slug" : String,
  "day": String,
  "isFull": Boolean
});

var SchedulesSchema = new Schema({
  "slug" : String,
  "isFull": Boolean,
  "hourStart": String,
  "hourEnd": String,
  "dayEnd": String,
  "dayStart": String,
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


// create an export function to encapsulate the model creation
module.exports = function() {
  var CourseSchemaEmbed = Schema({
    "slug" : String,
    "name" : String,
    "svg": String,
    "teachers" : [ TeachersSchema ]
  }); // courseSchema
  mongoose.model('Course', CourseSchemaEmbed);
};

/*
  {
    "name": "Yoga",
    "svg" : "",
    "teachers": [
      {
        "firstName": "Isabelle",
        "lastName": "Nadeau",
        "tel": "514-919-6318",
        "schoolName": "",
        "schoolUrl": "",
        "course": {
          "courseType": "Yoga doux",
          "note": "",
          "image": "/media/course_pic/Isabelle_Nadeau_300x300.jpg",
          "description": "",
          "price": "",
          "isVisible": true,
          "courseTypes": [
            {
              "name": "Yoga sur chaise",
              "description": "",
              "schedules": [
                {
                  "isFull": false,
                  "hourStart": "13:00:00",
                  "hourEnd": "14:15:00",
                  "dayEnd": "2016-06-13",
                  "dayStart": "2016-01-12",
                  "dayName": "mardi",
                  "testingDays": [
                    {
                      "day": "2016-01-26",
                      "isFull": false
                    }
                  ]
                }
              ]
            }
          ]
        }
      }]
    }
*/
