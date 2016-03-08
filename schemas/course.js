// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
  	// define schema
	var courseSchema = Schema({
	  id: Number,
	  teacherId: String,
	  courseNameId: String,
	  teacher: {
	    type: Schema.Types.ObjectId,
	    ref: 'Teacher'
	  },
	  courseName: {
	    type: Schema.Types.ObjectId,
	    ref: 'CourseName'
	  },
	  courseType: String,
	  note: String,
	  image: String,
	  description: String,
	  price: String,
	  isVisible: Boolean
	});
	mongoose.model('Course', courseSchema);
};