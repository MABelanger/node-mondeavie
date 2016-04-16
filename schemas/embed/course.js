"use strict";

// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('../../utils/utils');

function validatePresenceOf (value) {
  if(typeof value === 'string' || typeof value === 'number') {
      value = value.toString().trim();
  }
  return !!(value && value.length);
}

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
  "firstName" : {
    type: String, 
    validate: [validatePresenceOf, "Le prénom est invalide"],
    required: [true, "Le prénom est requis"]
  },
  "lastName" : {
    type: String, 
    validate: [validatePresenceOf, "Le nom est invalide"],
    required: [true, "Le nom est requis"]
  },
  "tel" : {
    type: String, 
    //validate: [validatePresenceOf, "Le téléphone est invalide"],
    //required: [true, "Le téléphone est requis"]
  },
  "schoolName" : {
    type: String, 
    //validate: [validatePresenceOf, "Le nom d école est invalide"],
    //required: [true, "Le nom d école est requis"]
  },
  "schoolUrl" : {
    type: String, 
    //validate: [validatePresenceOf, "L adresse url de l école est invalide"],
    //required: [true, "L adresse url de l école est requis"]
  },
  "course": CourseSchema
});

/*
var TeachersSchema = new Schema({
  "slug" : String,
  "firstName" : {
    type: String, 
    validate: [validatePresenceOf, "Le prénom est invalide"],
    required: [true, "Le prénom est requis"]
  },
  "lastName": String,
  "tel": String,
  "schoolName": String,
  "schoolUrl": String,
  "course": CourseSchema
});
*/

var CourseSchemaEmbed = Schema({
  "slug" : String,
  "name" : {
    type: String, 
    validate: [validatePresenceOf, "Le nom est invalide"],
    required: [true, 'Le nom est requis']
  },
  "svg": {
    type: String, 
    //validate: [validatePresenceOf, "Le svg est invalide"],
    //required: [true, 'Le svg est requis']
  },
  "teachers" : [ TeachersSchema ]
}); // courseSchema


// Hook on save method that create the slugs
CourseSchemaEmbed.pre('save', function(next) {
  // set the slugs value of course document and subDocuments
  utils.slugify(this);
  next();
});

// create an export function to encapsulate the model creation
module.exports = mongoose.model('Course', CourseSchemaEmbed);