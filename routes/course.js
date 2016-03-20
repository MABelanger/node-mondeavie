var Course = require('../schemas/embed/course');

function isValidId(id){
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    var course = req.body;
    Course.create(course, function(err, createdCourse){
      if( err ) throw err;
      res.json( createdCourse );
    });
  };

  functions.read = function(req, res){
    Course.read(req.params._id, function(err, course){
      if( err ) throw err;
      res.json(course);
    });
  }

  functions.update = function(req, res){
    var id =  req.params._id;
    var course = req.body;
    Course.update(id, course, function(err, updatedCourse){
      if( err ) throw err;
      res.json( updatedCourse );
    });
  }

  functions.delete = function(req, res){
    if(isValidId(req.params._id)) {
      Course.delete(req.params._id, function(err){
        if( err ) throw err;
        res.json({
          'status': 'deleted',
          '_id' : req.params._id
        });
      });
    }else{
      res.json({
        'status': 'ERROR: id invalid',
      });
    }
  }

  functions.list = function(req, res){
    Course.list(function(err, courses){
      if( err ) throw err;
      res.json(courses);
    });
  }

  return functions;
};
