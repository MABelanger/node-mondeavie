"use strict";

var Conference                 = require('../../schemas/embed/conference');
var dbUtils                    = require('../../utils/dbConference');


function _getObj(conference, idList){
  return conference;
}


module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    let conference = new Conference(req.body);
    dbUtils.saveConference(conference, res, [conference._id], _getObj);
  };

  functions.read = function(req, res){
    var conference_id =  req.params.conference_id;
    dbUtils.findConference(conference_id)
      .then( (conference) => {
        res.json(conference);
      }, (err) => {
        res.json(err);
      });
  }

  functions.update = function(req, res){
    var conference_id =  req.params.conference_id;
    var json = req.body;

    dbUtils.findConference(conference_id)
      .then( (conference) => {
        dbUtils.updateAttributes(conference, json);
        dbUtils.saveConference(conference, res, [conference_id], _getObj);

      }, (err) => {
        res.json(err);
      });
  }

  functions.delete = function(req, res){
    let conference_id = req.params.conference_id;

    dbUtils.findConference(conference_id)
      .then( (conference) => {
        Conference.findByIdAndRemove(conference_id, function(err){
          res.json({'status': 'deleted'});
        });

      }, (err) => {
        res.json(err);
      });
  }

  functions.list = function(req, res){
    Conference.find({}, function(err, conferences){
      if( err ) throw err;
      res.json(conferences);
    });
  }

  return functions;
};
