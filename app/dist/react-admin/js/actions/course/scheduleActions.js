"use strict";

// Vendor modules
import Request                        from "superagent";

// Flux
import ClientDispatcher               from "../../dispatcher/clientDispatcher";
import ScheduleConstants            from "../../constants/course/scheduleConstants";
// Flux (to get token)
import UserStore                      from '../../stores/user/userStore';

const { BASE_URL,
        LIST_SCHEDULE_EVENT,
        CREATE_SCHEDULE_EVENT,
        SAVED_SCHEDULE_EVENT,
        READ_SCHEDULE_EVENT,
        SAVE_SCHEDULE_EVENT,
        DELETE_SCHEDULE_EVENT,
        ERROR_SAVE_SCHEDULE_EVENT,
        ERROR_DELETE_SCHEDULE_EVENT } = ScheduleConstants;


function getFlatErrors(errors){
  let flatErrors = {};
  for (var property in errors) {
    if (errors.hasOwnProperty(property)) {
      // 'schedules.1.firstName' -> 'firstName'
      let newProperty = property.split('.').splice(-1);
      flatErrors[newProperty] = errors[ property ];
    }
  }
  return flatErrors;
}

function getUrl(courseId, teacherId, courseTypeId){
  return BASE_URL + 'courses/' + courseId 
                  + '/teachers/' + teacherId 
                  + '/course_description/course_types/' + courseTypeId
                  + '/schedules';
}

export function getSchedules(courseId, teacherId, courseTypeId) {
  let url = getUrl(courseId, teacherId, courseTypeId);
  let token = UserStore.getToken();
  Request
  .get(url)
  .set('Authorization', 'Bearer ' + token)
  .end(function(err, res){
    ClientDispatcher.dispatch({
      actionType: LIST_SCHEDULE_EVENT,
      schedules: res.body
    });
  });
}

export function createSchedule(schedule, courseId, teacherId, courseTypeId) {
  let url = getUrl(courseId, teacherId, courseTypeId);
  let token = UserStore.getToken();
  Request
    .post(url)
    .accept('application/json')
    .type('application/json')
    .send(schedule)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: CREATE_SCHEDULE_EVENT,
          schedule: res.body
        });
        // trigger refresh all schedules
        this.getSchedules(courseId, teacherId, courseTypeId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_SCHEDULE_EVENT,
            errors: getFlatErrors(res.body.errors)
          });
        }
        // TODO error connection
        // ClientDispatcher.dispatch({
        //   actionType: ERROR_CONNECTION,
        //   errors: err
        // });
      }
    });
}

export function saveSchedule(schedule, courseId, teacherId, courseTypeId) {
  let url = getUrl(courseId, teacherId, courseTypeId) + '/' + schedule._id;
  let token = UserStore.getToken();
  Request
    .put(url)
    .accept('application/json')
    .type('application/json')
    .send(schedule)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: SAVE_SCHEDULE_EVENT,
          schedule: res.body
        });
        // trigger refresh all schedules
        this.getSchedules(courseId, teacherId, courseTypeId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_SCHEDULE_EVENT,
            errors: getFlatErrors(res.body.errors)
          });
        }
        // TODO error connection
        // ClientDispatcher.dispatch({
        //   actionType: ERROR_CONNECTION,
        //   errors: err
        // });
      }
    });
}

export function deleteSchedule(schedule, courseId, teacherId, courseTypeId) {
  let url = getUrl(courseId, teacherId, courseTypeId) + '/' + schedule._id;
  let token = UserStore.getToken();
  Request
    .del(url)
    .accept('application/json')
    .type('application/json')
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: DELETE_SCHEDULE_EVENT,
          schedule: res.body
        });
        // trigger refresh all schedules
        this.getSchedules(courseId, teacherId, courseTypeId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_DELETE_SCHEDULE_EVENT,
            errors: getFlatErrors(res.body.errors)
          });
        }
        // TODO error connection
        // ClientDispatcher.dispatch({
        //   actionType: ERROR_CONNECTION,
        //   errors: err
        // });
      }
    });
}

