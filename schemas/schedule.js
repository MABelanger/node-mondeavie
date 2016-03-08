// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
  // define schema
	var scheduleSchema = Schema({
	  id: Number,
	  name: String,
	  description: String,
	  courseId: Number,
	  course: {
	    type: Schema.Types.ObjectId,
	    ref: 'Course'
	  }
	});
	mongoose.model('Schedule', scheduleSchema);
};
