var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

/**
 * Teacher schema
 */
var teacherSchema = Schema({
  id: Number,
  firstName: String,
  lastName: String,
  tel: String,
  schoolName: String,
  schoolUrl: String
});
var Teacher = mongoose.model('Teacher', teacherSchema);

/**
 * CourseName schemas
 */
var courseNameSchema = Schema({
  id: Number,
  name: String,
  icon: String
});
var CourseName = mongoose.model('CourseName', courseNameSchema);


/**
 * Course schema
 */
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
var Course = mongoose.model('Course', courseSchema);

/**
 * CourseName schemas
 */
var courseNameSchema = Schema({
  id: Number,
  name: String,
  description: String,
  courseId: Number,
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }
});
var CourseName = mongoose.model('CourseName', courseNameSchema);


/**
 * Connect to the console database on localhost with
 * the default port (27017)
 */

/*
mongoose.connect('mongodb://localhost/mavn', function(err) {
  // if we failed to connect, abort
  if (err) throw err;

  // we connected ok
  //createData();
});
*/

mongoose.connect('mongodb://localhost/mondeavie', function(err) {
  // if we failed to connect, abort
  if (err) throw err;

  // we connected ok
  findTree();
});

/**
 * Data generation
 */


function createCourse(teacher, courseName) {
  Course.create({
    id: "1",
    teacherId:"1",
    teacher: teacher,
    courseName: courseName,
    courseType: "yoga yogaDoux",
    note: "une note",
    image: "http://image",
    description: "une description",
    price: "50$",
    isVisible: true
  },
  function(err) {
    if (err) return done(err);
    find();
  });
}


function createCourseName(teacher) {
  CourseName.create(
    {
      id: "1",
      name: "Yoga",
      icon: "http://yoga"
    },
    function(err, courseName) {
      if (err) return done(err);
      createCourse(teacher, courseName)
    });
}


function createTeacher() {
  Teacher.create(
    {
      id: "1",
      firstName: "Alexandre",
      lastName: "Belanger",
      tel: "450 964 2586",
      schoolName: "Hebert",
      schoolUrl: "google.ca"
    },
    function(err, teacher) {
      if (err) return done(err);
      createCourseName(teacher)
    });

}
function createData() {
  createTeacher();
}

/**
 * Population
 */

function find() {
  Course
  .findOne({id: "1"})
  .populate('teacher')
  .populate('courseName')
  .exec(function(err, course) {
    if (err) return done(err);
    console.log(course);
    done();
  });
}


function getObjectId(objects, id) {
  var objectId = 0;
  objects.map(function(obj) {
    if( obj.id == id) {
      objectId = obj._id;
    }
  });
  //return new ObjectId(objectId);
  return objectId;
}

function findTree() {
  // {_id: '56d67dbe15288675475505c3'}
  Teacher
  .find( {} )
  .exec(function(err, teachers) {
    if (err) console.log("error" + err);
    teachers.map(function(teacher) {
      console.log('teacher : ' + teacher.id);
    });

    CourseName
    .find( {} )
    .exec(function(err, courseNames) {
      courseNames.map(function(courseName) {
        console.log('courseName : ' + courseName.id)
      });

      Course
      .find( {} )
      .exec(function(err, courses) {
        courses.map(function(course) {
          console.log('course.id : ' + course.id);
          //console.log('teacher._id : ' + getObjectId(teachers, course.teacherId) );
          //console.log('courseName._id : ' + getObjectId(courseNames, course.courseNameId) );
          course.teacher = getObjectId(teachers, course.teacherId);
          course.courseName = getObjectId(courseNames, course.courseNameId);
          course.save();
        });
      });
    });
  });
}

function done(err) {
  if (err) console.error(err);
  Teacher.remove(function() {
    Course.remove(function() {
      mongoose.disconnect();
    });
  });
}
