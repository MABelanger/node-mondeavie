// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var URL = 'mongodb://localhost/day-test';
// connect to monbodb
mongoose.connect(URL, function(err){
  if (err) throw err;
});

var daySchema = new Schema({
  "date" : Date,
  "startH" : Date,
  "endH": Date
},
{ 
  toObject: {virtuals: true}, 
  toJSON: {virtuals: true}
});

daySchema.virtual('yyyymmdd').get(function () {
  var yyyy = this.date.getFullYear().toString();
  var mm = (this.date.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.date.getDate().toString();
  return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
});


var Day = mongoose.model('Day', daySchema);


Day.find({}, function(err ,days){
  days.map(function(day){
    console.log(day.toJSON());
  });
})

/*
var day = new Day();
day.date = Date.now();
day.save(function(err, obj){
  console.log(obj);
  console.log( Day.aggregate({ $project: { day: { $dayOfMonth: "$date" } } }) );
});
*/


