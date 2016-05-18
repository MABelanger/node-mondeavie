
var _       = require('lodash'),
    jwt     = require('jsonwebtoken');
    config = require('../../config');


var users = config.USERS;

function _addError(errors, fieldName, message){
  var error = {
    "message": message,
    "name": "ValidatorError",
    "properties": {
      "type": "required",
      "message": message,
      "path": "name"
    },
    "kind": "required",
    "path": "name"
  };
  errors[fieldName] = error;
}

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
    var errors = {};

    var hasError = false;
    if(!userScheme.username){
      hasError=true;
      _addError(errors, 'user', "Le Nom d'utilisateur est requis")
    }

    if(!req.body.password){
       hasError=true;
      _addError(errors, 'password', "Le mot de passe est requis")
    }

    var user = _.find(users, 'username', userScheme.username);

    if(!hasError){
      if (!user) {
        hasError=true;
        _addError(errors, 'user', "Mot de passe ou nom d'utilisateur invalide");
        _addError(errors, 'password', "Mot de passe ou nom d'utilisateur invalide");
      }

      if (user.password !== req.body.password) {
        hasError=true;
        _addError(errors, 'user', "Mot de passe ou nom d'utilisateur invalide");
        _addError(errors, 'password', "Mot de passe ou nom d'utilisateur invalide");
      }
    }
    
    if(hasError){
      res.json({
        "message": "User validation failed",
        "name": "ValidationError",
        "errors": errors,
        "hasError": hasError
      });
    } else {
      res.status(201).send({
        id_token: createToken(user)
      });
    }
  };


  return functions;
};
