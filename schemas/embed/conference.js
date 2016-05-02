"use strict";

// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemasHelper = require('./helper');

var utils = require('../../utils/utils');


// TODO make slug to the schedule

var SchedulesSchema = new Schema({
  "slug" : String,
  "isFull": Boolean,
  "dayStart" : {
    type: Date, 
    validate: [schemasHelper.validateDate, "Le date de départ est invalide"],
    required: [true, "Le date de départ est requis"]
  },
  "dayEnd" : {
    type: Date, 
    validate: [schemasHelper.validateDate, "Le date de fin est invalide"],
    required: [true, "Le date de fin est requis"]
  }
});

var SpeakerSchema = Schema({
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
  }
});

var ConferenceSchema = new Schema({
  "slug" : String,
  "isVisible": Boolean,
  "title" : {
    type: String, 
    validate: [schemasHelper.validatePresenceOf, "Le titre est invalide"],
    required: [true, 'Le titre est requis']
  },
  "note": String,
  "price": String,
  "image": {
    url: String
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
  description: String,
  "abstract" : {
    type: String, 
    // validate: [schemasHelper.validatePresenceOf, "Le resume est invalide"],
    // required: [true, 'Le resume est requis']
  },
  "speaker" : SpeakerSchema,
  "schedules": [ SchedulesSchema ]
});


// Hook on save method that create the slugs
ConferenceSchema.pre('save', function(next) {
  // set the slugs value of course document and subDocuments
  console.log('pre.save')
  utils.slugifyConference(this);
  next();
});

ConferenceSchema.pre('validate', function(next){
  //console.log("pre validate called");
  //console.log('this', this);
  next();
});

// create an export function to encapsulate the model creation
module.exports = mongoose.model('Conference', ConferenceSchema);

/*
{
  "slug": "String",
  "speaker": {
    "slug": "String",
    "firstName": "String",
    "lastName": "String"
  },
  "title": "String",
  "tel": "String",
  "isVisible": true,
  "note": "String",
  "price": "String",
  "schoolName": "String",
  "schoolUrl": "String",
  "description": "String",
  "abstract": "String",
  "schedules": [
    {
      "isFull": false,
      "dayStart": "2016-04-01T11:00:00.000Z",
      "dayEnd": "2016-04-01T12:00:00.000Z",
    }
  ]
}
*/