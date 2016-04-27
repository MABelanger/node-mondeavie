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


  function _getMessage(emailFrom, emailTo, message){
  // Message object
    return {

      // sender info
      from: 'Sender Name <' + emailFrom + '>',

      // Comma separated list of recipients
      to: '"Receiver Name" <' + emailTo + '>',

      // Subject of the message
      subject: 'Demande de Réservation de mondeavie.ca', 

      // plaintext body
      // text: 'Hello to myself!',

      // HTML body
      html: message
    };
  }



  functions.send = function(req, res){
    console.log('credentials.USER', credentials.USER);
    console.log('req.body', req.body)

    var reservation = req.body;

    console.log('Sending Mail');
    var email = _getMessage(reservation.from, credentials.TO, reservation.message);
    transport.sendMail(email, function(error){
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
