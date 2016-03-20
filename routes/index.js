var bodyParser = require('body-parser');

// Load routes
var routeCourse = require('./course');

module.exports = function (app) {

  // Parse the body into Obj
  app.use(bodyParser.json());

  app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
  });

  // Show message to use path /api if user try to use the root path
  app.get('/', function(req, res){
    res.send('use /api');
  });

  /* 
   * CRUD operations for the course
   */
  app.post('/api/courses', routeCourse().create); // Create
  app.get('/api/courses/:_id', routeCourse().read); // Read
  app.put('/api/courses/:_id', routeCourse().update); // Update
  app.delete('/api/courses/:_id', routeCourse().delete); // Delete
  app.get('/api/courses', routeCourse().list); // List

};