"use strict";

var mongoose = require('mongoose');
var Conference = require('../schemas/embed/conference');


// TODO put common module for conference and course

function isValidId(id){
  return mongoose.Types.ObjectId.isValid(id);
}


function _saveConference(conference, res, isDelete, idList, getObjCb){

  conference.save( function(err, conference){
    if( err ) {
      res.status(400);
      res.json(err);
    } else {
      // if is no delete, call the cb fct with the right args
      if( isDelete ) {
        res.json({'status': 'deleted'});
      // 
      } else {
        res.json(getObjCb(conference, idList));
      }
    }
  });
}


function saveConference(conference, res, idList, getObjCb){
  let isDelete = false;
  _saveConference(conference, res, isDelete, idList, getObjCb);
}

function updateDeletedObj(conference, res){
  let isDelete = true;
  _saveConference(conference, res, isDelete);
}

function updateAttributes(obj, json){
  // if conferenceDescription do not exist, create an empty object 
  // to add properties to it.
  if (! obj ){ // check if is not null
    obj = {};
  }
  // update all attributes specified in the json
  for (var attName in json) {
    obj[attName] = json[attName];
  }
  return obj;
}


function findConference(conference_id){
  var promise = new Promise(function(resolve, reject) {
    Conference.findById( conference_id, (err, conference) => {
      if (! err ) {
        resolve(conference);
      }
      else {
        reject(err);
      }
    });
  });
  return promise;
}

var DbConference = {
  isValidId: isValidId,
  findConference: findConference,
  saveConference: saveConference,
  updateDeletedObj: updateDeletedObj,
  updateAttributes: updateAttributes
};

module.exports = DbConference;
