"use strict";

var credentials            = require('../../credentials');

var dbUtils                = require('../../utils/dbCourse');
var nodemailer             = require('nodemailer');
var smtpTransport          = require('nodemailer-smtp-transport');


var transport = nodemailer.createTransport(smtpTransport({
        host: credentials.HOST,
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587,
        auth: {
            //user: 'info@mondeavie.mtrema.com',
            user: credentials.USER,
            pass: credentials.PASSWORD
        },
        tls: {
            //rejectUnauthorized: false,
            ciphers:'SSLv3'
        },
        debug:true
    })
);

module.exports = function () {

  var functions = {};


  console.log('SMTP Configured');


  function _getSendMailMessage(emailFrom, emailReplyTo, emailTo, message){
  // Message object
    return {

      // sender info
      'from':  emailFrom,

      // Comma separated list of recipients
      'to': '"Receiver Name" <' + emailTo + '>',

      'replyTo': emailReplyTo,

      // Subject of the message
      'subject': 'Demande de Réservation de mondeavie.ca', 

      // plaintext body
      // text: 'Hello to myself!',

      // HTML body
      'html': message
    };
  }


  function _getField(label, value){
    return "<b>" + label + "</b>" + ": " + value + "<br/>";
  }

  function _getSelectedList(selectedDates){
    var SelectedDates = "<ul>";
    SelectedDates += selectedDates.map(function (selectedDate, index){
      return "<li>" + selectedDate + "</li>";
    });
    SelectedDates += "</ul>";
    return SelectedDates;
  }

  function _getMessageHtml(reservation){
    var messageHtml = reservation.reservationHeader;
    messageHtml += _getField("Nom", reservation.name);
    messageHtml += _getField("Tel", reservation.tel);
    messageHtml += _getField("Courriel", reservation.email);
    if(reservation.note){
      messageHtml += _getField("Note", reservation.note);
    }
    if(reservation.selectedDates){
      messageHtml += _getField("Dates", _getSelectedList(reservation.selectedDates));
    }
    return messageHtml;
  };



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

  function _getErrors(reservation){
    var errors = {};

    var hasError = false;
    if(!reservation.name){
      hasError=true;
      _addError(errors, 'name', "Le Nom est requis")
    }

    if(!reservation.tel){
       hasError=true;
      _addError(errors, 'tel', "Le Téléphone est requis")
    }

    if(!reservation.email){
       hasError=true;
      _addError(errors, 'email', "Le Courriel est requis")
    }

    if(reservation.selectedDates && reservation.selectedDates.length == 0){
       hasError=true;
      _addError(errors, 'selectedDates', "Sélectionner une ou plusieurs dates.")
    }

    return {
      "message": "Course validation failed",
      "name": "ValidationError",
      "errors": errors,
      "hasError": hasError
    };
  }


  function _sendEmail(reservation, res){
    var messageHtml = _getMessageHtml(reservation);

    var sendMailMessage = _getSendMailMessage(
          credentials.FROM,
          reservation.email,
          credentials.TO,
          messageHtml
        );

    transport.sendMail(sendMailMessage, function(error){
      if(error){
          console.log(error.message);
          res.json({status: "Error" + error.message});
          return;
      }
      console.log('Message sent successfully!');
      res.json({
        status: "Message sent successfully!",
        messageHtml: messageHtml
      });

      // if you don't want to use this transport object anymore, uncomment following line
      transport.close(); // close the connection pool
    });
  }

  functions.send = function(req, res){
    var reservation = req.body;
    var errors = _getErrors(reservation);

    if(errors.hasError){
      res.json(errors);
    } else {
      _sendEmail(reservation, res);
    }
  };

  return functions;
};
