// Load routes
var routeCourse = require('./course');
var routeTeacher = require('./teacher');
var routeCourseDescription = require('./courseDescription');
var routeCourseType = require('./courseType');
var routeSchedule = require('./schedule');
var routeFreeDay = require('./freeDay');
var routeReservation = require('./reservation');

module.exports = function (app) {
  /**
   * CRUD operations for the course
   */
  app.post('/api/courses', routeCourse().create); // Create
  app.get('/api/courses/:course_id', routeCourse().read); // Read
  app.put('/api/courses/:course_id', routeCourse().update); // Update
  app.delete('/api/courses/:course_id', routeCourse().delete); // Delete
  app.get('/api/courses', routeCourse().list); // List

  /* 
   * CRUD operations for the teacher
   */
  app.post('/api/courses/:course_id/teachers', routeTeacher().create); // Create
  app.get('/api/courses/:course_id/teachers/:teacher_id', routeTeacher().read); // Read
  app.put('/api/courses/:course_id/teachers/:teacher_id', routeTeacher().update); // Update
  app.delete('/api/courses/:course_id/teachers/:teacher_id', routeTeacher().delete); // Delete
  app.get('/api/courses/:course_id/teachers', routeTeacher().list); // List

  /* 
   * CRUD operations for course description
   */
  //app.post('/api/courses/:course_id/teachers/:teacher_id/course_description', routeCourseDescription().create); // Create
  app.get('/api/courses/:course_id/teachers/:teacher_id/course_description', routeCourseDescription().read); // Read
  app.put('/api/courses/:course_id/teachers/:teacher_id/course_description', routeCourseDescription().update); // Update
  app.delete('/api/courses/:course_id/teachers/:teacher_id/course_description', routeCourseDescription().delete); // Delete


  /* 
   * CRUD operations for course type
   */
  app.post('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types', routeCourseType().create); // Create
  app.get('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id', routeCourseType().read); // Read
  app.put('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id', routeCourseType().update); // Update
  app.delete('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id', routeCourseType().delete); // Delete
  app.get('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types', routeCourseType().list); // List

 /* 
  * CRUD operations for schedule
  */
  app.post('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id/schedules', routeSchedule().create); // Create
  app.get('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id/schedules/:schedule_id', routeSchedule().read); // Read
  app.put('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id/schedules/:schedule_id', routeSchedule().update); // Update
  app.delete('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id/schedules/:schedule_id', routeSchedule().delete); // Delete
  app.get('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id/schedules', routeSchedule().list); // List

 /* 
  * CRUD operations for testing day
  */
  app.post('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id/schedules/:schedule_id/free_days', routeFreeDay().create); // Create
  app.get('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id/schedules/:schedule_id/free_days/:free_day_id', routeFreeDay().read); // Read
  app.put('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id/schedules/:schedule_id/free_days/:free_day_id', routeFreeDay().update); // Update
  app.delete('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id/schedules/:schedule_id/free_days/:free_day_id', routeFreeDay().delete); // Delete
  app.get('/api/courses/:course_id/teachers/:teacher_id/course_description/course_types/:course_type_id/schedules/:schedule_id/free_days', routeFreeDay().list); // List

 /* 
  * Send reservation
  */
  app.post('/api/reservations/', routeReservation().send); // Create
};