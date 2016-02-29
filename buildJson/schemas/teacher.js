// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
  // define schema
  var TeacherSchema = new Schema({
    firstName: String,
    lastName: String,
    tel: String,
    schoolName: String,
    schoolUrl: String
  });

  mongoose.model('Allo', TeacherSchema);
};