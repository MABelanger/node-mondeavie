// Load routes
var routeUser = require('./user');
var routeReservation = require('./reservation');

module.exports = function (app) {

  /**
   * User operations
   */
  app.post('/public/api/sessions/authentication', routeUser().login); // Authenticate
  app.post('/public/api/reservations/', routeReservation().send); // Public Create
};