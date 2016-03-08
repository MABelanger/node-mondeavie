// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
  // define schema
	var teacherSchema = Schema({
	  id: Number,
	  firstName: String,
	  lastName: String,
	  tel: String,
	  schoolName: String,
	  schoolUrl: String
	});
  mongoose.model('Teacher', teacherSchema);
};