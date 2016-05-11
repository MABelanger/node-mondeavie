// Load routes
var routeUser = require('./user');

module.exports = function (app) {

  /**
   * User operations
   */
  app.post('/public/api/sessions/authentication', routeUser().login); // Authenticate
  app.get('/api/sessions/private', routeUser().private); // Authenticate
};