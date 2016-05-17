
var _       = require('lodash'),
    jwt     = require('jsonwebtoken');
    config = require('../../config');


var users = config.USERS;

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.SECRET, { expiresIn: 60*60*5 });
}

function getUserScheme(req) {
  
  var username;
  var fullName;

  if(req.body.username) {
    username = req.body.username;
  }

  if(req.body.fullName) {
    fullName = req.body.fullName;
  }

  return {
    username: username,
    fullName: fullName,
  }
}




module.exports = function () {

  var functions = {};

  functions.login = function(req, res){
    var userScheme = getUserScheme(req);
    console.log('req.body', req.body);

    if (!userScheme.username || !req.body.password) {
      return res.status(400).send("You must send the username and the password");
    }
    console.log('Before user', userScheme.username)
    var user = _.find(users, 'username', userScheme.username);
    console.log('user', user)
    
    if (!user) {
      return res.status(401).send("The username or password don't match");
    }

    if (user.password !== req.body.password) {
      return res.status(401).send("The username or password don't match");
    }


    res.status(201).send({
      id_token: createToken(user)
    });
  };


  functions.private = function(req, res){
    res.status(201).send({
      status: 'ok'
    });
  };

  return functions;
};
