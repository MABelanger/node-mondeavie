"use strict";
//  node ../../../node_modules/nodemon/bin/nodemon.js read.js
var Request     = require("superagent");
var parsedJSON = require('./57.json');
var moment = require('moment');
var fs = require('fs');



let conference = {
  slug: null,
  speaker: {
    slug: null,
    firstName: null,
    lastName: null
  },
  title: null,
  tel: null,
  isVisible: null,
  note: null,
  price: null,
  schoolName: null,
  schoolUrl: null,
  description: null,
  abstract: null,
  "image": {
    "url": null,
    "dataUri": null,
  },
  schedules: [
    {
      isFull: null,
      dayStart: null,
      dayEnd: null,
    }
  ]
};

// function to encode file data to base64 encoded string
function base64_encode(bitmap) {
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

function readImage(url, cb) {
  Request
  .get(url, function(err, res){
    if(!err){
      let buffer = res.body;
      let base64 = "data:image/jpeg;base64," + buffer.toString('base64');
      cb(base64);
    }
  });
}




function saveConference(obj){
  const CONFERENCE_URL = 'http://localhost:3000/api/conferences';
  var promise = new Promise(function(resolve, reject) {
    Request
      .post(CONFERENCE_URL)
      .accept('application/json')
      .type('application/json')
      .send(obj)
      .end((err, res) => {
        if (! err ) {
          resolve(res.body);
        }
        else {
          reject(err);
        }
      });
  });
  return promise;
}

function deleteConference(conference) {
  const CONFERENCE_URL = 'http://localhost:3000/api/conferences';
  var promise = new Promise(function(resolve, reject) {
    Request
      .del(CONFERENCE_URL + '/' + conference._id)
      .accept('application/json')
      .type('application/json')
      .send(conference)
      .end((err, res) => {
        if (! err ) {
          resolve(res.body);
        }
        else {
          reject(err);
        }
      });
  });
  return promise;
}

function getSchedule(objDate){
  let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

  let strDateStart = objDate.day + " " + objDate.hour_start;
  let strDateEnd = objDate.day + " " + objDate.hour_end;

  //let mDate = moment('5 mai 2016 09:30', 'DD MMM YYYY HH:mm', 'fr');
  let mDateStart = moment(strDateStart, 'DD MMM YYYY HH:mm', 'fr');
  let mDateEnd = moment(strDateEnd, 'DD MMM YYYY HH:mm', 'fr');

  let noOffsetStart = moment(mDateStart - tzoffset).utcOffset(0);
  let noOffsetEnd = moment(mDateEnd - tzoffset).utcOffset(0);

  return {
    dayStart : noOffsetStart.toISOString(),
    dayEnd : noOffsetEnd.toISOString(),
    isFull: objDate.is_full
  }
}

function getSchedules(dayConferences){
  let schedules = dayConferences.map(function(dayConference){
    return getSchedule(dayConference)
  });

  return schedules;
}


if(parsedJSON.speakers.length == 1){
  conference.speaker.firstName = parsedJSON.speakers[0].first_name;
  conference.speaker.lastName = parsedJSON.speakers[0].last_name;
}



conference.title = parsedJSON.title;
conference.description = parsedJSON.description;
conference.abstract = parsedJSON.abstract;
conference.price = parsedJSON.price;
conference.tel = parsedJSON.tel;
conference.note = parsedJSON.note;
conference.schoolName = parsedJSON.school_name;
conference.schoolUrl = parsedJSON.school_url;
conference.isVisible = parsedJSON.is_visible;
conference.schedules = undefined;


let imageUrl = 'http://www.mondeavie.ca/' + parsedJSON.image;
console.log('imageUrl', imageUrl);
//imageUrl = 'http://localhost:3000/media/img/conference/string_string-string.jpg';
readImage(imageUrl, function(base64){
  //console.log('base64:_', base64)
  conference.image.dataUri = base64;



  conference.schedules = getSchedules(parsedJSON.day_conferences);

  saveConference(conference)
    .then( (conference) => {
      console.log('conference', conference)

      // deleteConference(conference)
      //   .then( (conference) => {
      //     console.log('ok');
      //   }, (errors) => {
      //     console.log('err', errors)
      //   });

    }, (errors) => {
      console.log('err', errors)
    });
});






















