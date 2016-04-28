"use strict";

var credentials            = require('../credentials');

var dbUtils                = require('../utils/db');
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
    var messageHtml = ""
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



  functions.send = function(req, res){
    console.log('credentials.USER', credentials.USER);
    console.log('req.body', req.body)

    var reservation = req.body;
    var messageHtml = _getMessageHtml(reservation);

    var sendMailMessage = _getSendMailMessage(
          credentials.FROM,
          reservation.email,
          credentials.TO,
          messageHtml
        );

    console.log('Before sendMail()');
    transport.sendMail(sendMailMessage, function(error){
      if(error){
          console.log('Error occured');
          console.log(error.message);
          res.json({status: "Error" + error.message});
          return;
      }
      console.log('Message sent successfully!');
      res.json({status: "Message sent successfully!"});

      // if you don't want to use this transport object anymore, uncomment following line
      transport.close(); // close the connection pool
    });


    
  };

  return functions;
};
