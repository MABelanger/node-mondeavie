// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
  var testingDaySchema = Schema({
    id: String,
    day: String,
    isFull: Boolean,
    dayScheduleId : String,
    daySchedule: {
      type: Schema.Types.ObjectId,
      ref: 'DaySchedule'
    }
  });
  mongoose.model('TestingDay', testingDaySchema);
};
