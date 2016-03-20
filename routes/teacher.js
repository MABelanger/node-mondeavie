var Teacher = require('../schemas/embed/course').teachers;

function isValidId(id){
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = function () {

  var functions = {};

  functions.create = function(req, res){
    var course = req.body;
    Teacher.create(course, function(err, createdTeacher){
      if( err ) throw err;
      res.json( createdTeacher );
    });
  };

  functions.read = function(req, res){
    Teacher.read(req.params._id, function(err, course){
      if( err ) throw err;
      res.json(course);
    });
  }

  functions.update = function(req, res){
    var id =  req.params._id;
    var course = req.body;
    Teacher.update(id, course, function(err, updatedTeacher){
      if( err ) throw err;
      res.json( updatedTeacher );
    });
  }

  functions.delete = function(req, res){
    if(isValidId(req.params._id)) {
      Teacher.delete(req.params._id, function(err){
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
    Teacher.list(function(err, courses){
      if( err ) throw err;
      res.json(courses);
    });
  }

  return functions;
};
