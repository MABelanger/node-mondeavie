app.get('/test', function(req, res) {
  Course.findOne({'_id' : '56df6f349e9a0e869f9ba190' }, function(err, course){
    console.log('course', course)


    var newTestingDay = {
              "day2" : "2050-01-13",
              "isFull" : false,
              "_id":"56dfa5acb1ee3eaca339bdb2"
    };
    var bigObj = course.teachers.id('56df6f349e9a0e869f9ba191').course.courseTypes
    .id('56df9b4ff4e198d9a275a179')
    .schedules.id('56dfa5acb1ee3eaca339bdb1')
    .testingDays.id('56dfa5acb1ee3eaca339bdb2');

    for (var field in newTestingDay) {
      bigObj[ field ] = newTestingDay[ field ];
    }

    //course.markModified('teachers.course.courseTypes.name');
    course.save(function (err) {
      if (err) console.log(err);
      console.log('Success!');
      res.json(course);
    });
  }); // find
});