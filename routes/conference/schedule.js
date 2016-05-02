"use strict";

var dbUtils                    = require('../../utils/dbConference');

function _getObj(conference, idList){
  let schedule_id = idList[0];

  let schedules = conference.schedules;

  if( schedule_id ) {
    let schedule = schedules.id(schedule_id);
    return schedule;
  }

  // if no id specified, return the last created one.
  return schedules[ schedules.length -1 ];
}

module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    let conference_id = req.params.conference_id;
    let schedule_id = null;
    let obj = req.body;


    dbUtils.findConference(conference_id)
      .then( (conference) => {
        conference.schedules.push( obj );
        dbUtils.saveConference(conference, res, [schedule_id], _getObj);
      }, (err) => {
        res.json(err);
      });
  };

  functions.read = function(req, res){
    let conference_id = req.params.conference_id;
    let schedule_id = req.params.schedule_id;

    dbUtils.findConference(conference_id)
      .then( (conference) => {

        let schedule = conference.schedules.id(schedule_id);

        res.json(schedule);
      }, (err) => {
        res.json(err);
      });
  }

  functions.update = function(req, res){
    let conference_id = req.params.conference_id;
    let schedule_id = req.params.schedule_id;
    let json = req.body;

    dbUtils.findConference(conference_id)
      .then( (conference) => {
        let schedule = conference.schedules.id(schedule_id);

        schedule = dbUtils.updateAttributes(schedule, json);

        dbUtils.saveConference(conference, res, [schedule_id], _getObj);

      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res) {
    let conference_id = req.params.conference_id;
    let schedule_id = req.params.schedule_id;


    dbUtils.findConference(conference_id)
      .then( (conference) => {

        conference.schedules.pull(schedule_id);

        dbUtils.updateDeletedObj(conference, res);

      }, (err) => {
        res.json(err);
      });
  }

  functions.list = function(req, res){
    let conference_id = req.params.conference_id;
    let schedule_id = req.params.schedule_id;

    dbUtils.findConference(conference_id)
      .then( (conference) => {

        let schedules = conference.schedules;

        res.json(schedules);
      }, (err) => {
        res.json(err);
      });
  }

  return functions;
};
