// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
  var dayScheduleSchema = Schema({
    id: Number,
    isFull: Boolean,
    hourStart: String,
    hourEnd: String,
    dayNameId: Number,
    dayName: String,
    scheduleId: Number,
    schedule: {
      type: Schema.Types.ObjectId,
      ref: 'Schedule'
    },
    dayEnd: String,
    dayStart: String
  });
  mongoose.model('DaySchedule', dayScheduleSchema);
};
