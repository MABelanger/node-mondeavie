// Load routes
var routeUser = require('./user');

module.exports = function (app) {

  app.use('/api/sessions/private', app.jwtCheck);

  /**
   * User operations
   */
  app.post('/api/sessions/authentication', routeUser().login); // Authenticate
  app.get('/api/sessions/private', routeUser().private); // Authenticate
};