var mongoose = require('mongoose');
require('./schemas/teacher.js')();

var Teacher = mongoose.model('Allo');

mongoose.connect('mongodb://localhost/mondeavie', function(err) {
  if (err) {
    throw err;
  }

  Teacher.create({
    firstName: "fn",
    lastName: "ln",
    tel: "tel",
    schoolName: "sn",
    schoolUrl: "su"
  });

  Teacher.find().exec(function(err, res) {
    console.log('result %s', res);
    mongoose.connection.close();
  });
});