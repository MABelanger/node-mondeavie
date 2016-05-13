"use strict";
//  node ../../../node_modules/nodemon/bin/nodemon.js read.js
var Request     = require("superagent");
var moment = require('moment');
var fs = require('fs');



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




function convertConference(json, cb){
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

  if(json.speakers.length == 1){
    conference.speaker.firstName = json.speakers[0].first_name;
    conference.speaker.lastName = json.speakers[0].last_name;
  }

  conference.title = json.title;
  conference.description = json.description;
  conference.abstract = json.abstract;
  conference.price = json.price;
  conference.tel = json.tel;
  conference.note = json.note;
  conference.schoolName = json.school_name;
  conference.schoolUrl = json.school_url;
  conference.isVisible = json.is_visible;
  conference.schedules = undefined;


  let imageUrl = 'http://www.mondeavie.ca/' + json.image;
  readImage(imageUrl, function(base64){
    conference.image.dataUri = base64;

    conference.schedules = getSchedules(json.day_conferences);

    saveConference(conference)
      .then( (conference) => {
        console.log('conference', conference)

        cb(conference);
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
}

function readDayConference(url, cb) {
  Request
  .get(url, function(err, res){
    if(!err){
      cb(res.body);
    }
  });
}

  for(let i=0; i<100; i++){
    let url = 'http://www.mondeavie.ca/calendar_activities/api/nested/childs/conferences/'+ i + '?format=json';
    readDayConference(url, function(json){
      convertConference(json, function(conference){
        console.log('conference._id', conference._id);
      });
    });
  }


