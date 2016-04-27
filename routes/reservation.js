"use strict";

var credentials            = require('../credentials')();

var dbUtils                = require('../utils/db');


module.exports = function () {

  var functions = {};

  functions.send = function(req, res){
    console.log('credentials.USER', credentials.USER);
    console.log('req.body', req.body)

    var message = req.body;


    res.json({status: "ok"});
  };

  return functions;
};
