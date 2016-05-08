// Load routes
var routeConference = require('./conference');
var routeSchedule = require('./schedule');

module.exports = function (app) {

  /**
   * CRUD operations for the conference
   */
  app.post('/api/conferences', routeConference().create); // Create
  app.get('/api/conferences/:conference_id', routeConference().read); // Read
  app.put('/api/conferences/:conference_id', routeConference().update); // Update
  app.delete('/api/conferences/:conference_id', routeConference().delete); // Delete
  app.get('/api/conferences', routeConference().list); // List

  /* 
   * CRUD operations for the schedule
   */
  app.post('/api/conferences/:conference_id/schedules', routeSchedule().create); // Create
  app.get('/api/conferences/:conference_id/schedules/:schedule_id', routeSchedule().read); // Read
  app.put('/api/conferences/:conference_id/schedules/:schedule_id', routeSchedule().update); // Update
  app.delete('/api/conferences/:conference_id/schedules/:schedule_id', routeSchedule().delete); // Delete
  app.get('/api/conferences/:conference_id/schedules', routeSchedule().list); // List

 /* 
  * Public API
  */
  app.get('/public/api/conferences', routeConference().list); // List

};