// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
  // define schema
	var courseNameSchema = Schema({
	  id: Number,
	  name: String,
	  icon: String
	});
	mongoose.model('CourseName', courseNameSchema);
};
