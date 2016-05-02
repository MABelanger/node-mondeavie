"use strict";

// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('../../utils/utils');
var schemasHelper = require('./helper');


var freeDaysSchema = new Schema({
  "slug" : String,
  "day" : {
    type: Date, 
    validate: [schemasHelper.validateDate, "Le date est invalide"],
    required: [true, "Le date est requis"]
  },
  "isFull": Boolean
});

var SchedulesSchema = new Schema({
  "slug" : String,
  "isFull": Boolean,
  "dayEnd" : {
    type: Date, 
    validate: [schemasHelper.validateDate, "Le date de fin est invalide"],
    required: [true, "Le date de fin est requis"]
  },
  "dayStart" : {
    type: Date, 
    validate: [schemasHelper.validateDate, "Le date de départ est invalide"],
    required: [true, "Le date de départ est requis"]
  },
  "dayName": String,
  "freeDays": [ freeDaysSchema ]
});

var courseTypesSchema = new Schema({
  "slug" : String,
  "name" : {
    type: String, 
    validate: [schemasHelper.validatePresenceOf, "Le titre est invalide"],
    required: [true, "Le titre est requis"]
  },
  "description": String,
  "schedules": [ SchedulesSchema ]
});

var CourseSchema = new Schema({
  "slug" : String,
  "courseType" : {
    type: String, 
    validate: [schemasHelper.validatePresenceOf, "Le type est invalide"],
    required: [true, "Le type est requis"]
  },
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
    validate: [schemasHelper.validatePresenceOf, "Le prénom est invalide"],
    required: [true, "Le prénom est requis"]
  },
  "lastName" : {
    type: String, 
    validate: [schemasHelper.validatePresenceOf, "Le nom est invalide"],
    required: [true, "Le nom est requis"]
  },
  "tel" : {
    type: String, 
    //validate: [schemasHelper.validatePresenceOf, "Le téléphone est invalide"],
    //required: [true, "Le téléphone est requis"]
  },
  "schoolName" : {
    type: String, 
    //validate: [schemasHelper.validatePresenceOf, "Le nom d école est invalide"],
    //required: [true, "Le nom d école est requis"]
  },
  "schoolUrl" : {
    type: String,
    //validate: [schemasHelper.validatePresenceOf, "L adresse url de l école est invalide"],
    //required: [true, "L adresse url de l école est requis"]
  },
  "course": CourseSchema
});

var CourseSchemaEmbed = Schema({
  "slug" : String,
  "name" : {
    type: String, 
    validate: [schemasHelper.validatePresenceOf, "Le nom est invalide"],
    required: [true, 'Le nom est requis']
  },
  "svg": {
    type: String, 
    //validate: [schemasHelper.validatePresenceOf, "Le svg est invalide"],
    //required: [true, 'Le svg est requis']
  },
  "teachers" : [ TeachersSchema ]
}); // courseSchema


// Hook on save method that create the slugs
CourseSchemaEmbed.pre('save', function(next) {
  // set the slugs value of course document and subDocuments
  utils.slugifyCourse(this);
  next();
});

CourseSchemaEmbed.pre('validate', function(next){
    //console.log("pre validate called");
    //console.log('this', this);
    next();
});

// create an export function to encapsulate the model creation
module.exports = mongoose.model('Course', CourseSchemaEmbed);