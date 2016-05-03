"use strict";

var Conference                 = require('../../schemas/embed/conference');
var dbUtils                    = require('../../utils/dbConference');
var utils                      = require('../../utils/utils');


var BASE_IMG_URL = 'media/img/conference/'; // TODO: add constant module

function _getObj(conference, idList){
  return conference;
}

// we don't need the filename of the client
// the fileName is renamed with teacherSlug_courseSlug.jpg
//let fileName = json.image.fileName;
function _updateImage(json, conference, res){
  let dataUri = json.image.dataUri;
  let conference_id = conference._id;

  // get the json version because, if conference has not been saved,
  // no pre.save has been executed so the slug is missing.
  let conferenceJson = utils.slugifyConference(json);


  let fileNameOriginal = conferenceJson.slug +'_' + conferenceJson.speaker.slug + '_original' + '.jpg';
  let urlOriginal = BASE_IMG_URL + fileNameOriginal;


  let fileNameResize = conferenceJson.slug +'_' + conferenceJson.speaker.slug + '.jpg';
  let urlResize = BASE_IMG_URL + fileNameResize;


  // save the original
  utils.saveImage(dataUri, urlOriginal, {width:null, height:null}, function(url){
    // save the smaller
    utils.saveImage(dataUri, urlResize, {width:300, height:null}, function(url){
      // set the path to the image
      let image = {
        url: url
      }
      conference.image = image;
      dbUtils.saveConference(conference, res, [conference_id], _getObj);
    });
  });
};



module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    var json = req.body;
    let conference = new Conference(json);

    // check if is a new upload image. If so,
    // save it on the file and save the path to the db.
    if (json.image && json.image.dataUri) {
      _updateImage(json, conference, res);

    } else {
      dbUtils.saveConference(conference, res, [conference._id], _getObj);
    }
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

        // check if is a new upload image. If so,
        // save it on the file and save the path to the db.
        if (json.image && json.image.dataUri) {
          _updateImage(json, conference, res);

        } else {
          dbUtils.saveConference(conference, res, [conference_id], _getObj);
        }
        

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
