// Load routes
var routeUser = require('./user');

module.exports = function (app) {

  /**
   * User operations
   */
  app.post('/api/sessions/authentication', routeUser().login); // Authenticate
};