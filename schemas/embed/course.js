"use strict";

// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('../../utils/utils');
var schemasHelper = require('./helper');

var BASE_IMG_URL = 'media/img/course_description/'; // TODO: add constant module
var SAVE_IMAGE_FILES_HOOK = false;

function _updateImage(json, course, teacher, cb){

  let dataUri = json.image.dataUri;
  let fileName = teacher.slug +'_' + course.slug + '.jpg';
  let url = BASE_IMG_URL + fileName;


  let fileNameOriginal = teacher.slug +'_' + course.slug + '_original' + '.jpg';
  let urlOriginal = BASE_IMG_URL + fileNameOriginal;


  let fileNameResize = teacher.slug +'_' + course.slug + '.jpg';
  let urlResize = BASE_IMG_URL + fileNameResize;


  // save the original
  utils.saveImage(dataUri, urlOriginal, {width:null, height:null}, function(url){
    // save the smaller
    utils.saveImage(dataUri, urlResize, {width:300, height:null}, function(url){
      cb(url);
    });
  });
};


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
    url: String,
    dataUri: String
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


function saveImageFilesHook(_this, next){
  // uncomment step 2
  if(_this.teachers){
    for(let i=0; i<_this.teachers.length; i++){
      let teacher = _this.teachers[i];
      if (teacher.course.image && teacher.course.image.dataUri) {
        _updateImage(teacher.course, _this, teacher, function(url){
          // set the path to the image
          console.log('url', url);
          let image = {
            url: url
          }
          teacher.course.image = image;
        });
      }
    }
  }
  // 30 seconds
  setTimeout(next, 1000*30);
}

// Hook on save method that create the slugs
CourseSchemaEmbed.pre('save', function(next) {
  // set the slugs value of course document and subDocuments
  utils.slugifyCourse(this);
  // step 2
  if(SAVE_IMAGE_FILES_HOOK){
    saveImageFilesHook(this, next);
  }
  else {
    next();
  }
});

CourseSchemaEmbed.pre('validate', function(next){
    next();
});

// create an export function to encapsulate the model creation
module.exports = mongoose.model('Course', CourseSchemaEmbed);