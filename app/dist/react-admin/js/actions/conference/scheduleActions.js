"use strict";

// Vendor modules
import Request                        from "superagent";

// Flux
import ClientDispatcher               from "../../dispatcher/clientDispatcher";
import ScheduleConstants              from "../../constants/conference/scheduleConstants";

// Flux (to get token)
import UserStore                      from '../../stores/user/userStore';

const { URL,
        LIST_CONFERENCE_SCHEDULE_EVENT,
        CREATE_CONFERENCE_SCHEDULE_EVENT,
        SAVED_CONFERENCE_SCHEDULE_EVENT,
        READ_CONFERENCE_SCHEDULE_EVENT,
        SAVE_CONFERENCE_SCHEDULE_EVENT,
        DELETE_CONFERENCE_SCHEDULE_EVENT,
        ERROR_SAVE_CONFERENCE_SCHEDULE_EVENT,
        ERROR_DELETE_CONFERENCE_SCHEDULE_EVENT } = ScheduleConstants;

function getFlatErrors(errors){
  let flatErrors = {};
  for (var property in errors) {
    if (errors.hasOwnProperty(property)) {
      // 'teachers.1.firstName' -> 'firstName'
      let newProperty = property.split('.').splice(-1);
      flatErrors[newProperty] = errors[ property ];
    }
  }
  return flatErrors;
}

function getUrl(conferenceId){
  return URL  + '/' + conferenceId 
              + '/schedules';
}

export function getSchedules(conferenceId) {
  let url = getUrl(conferenceId);
  let token = UserStore.getToken();
  Request
  .get(url)
  .set('Authorization', 'Bearer ' + token)
  .end(function(err, res){
    ClientDispatcher.dispatch({
      actionType: LIST_CONFERENCE_SCHEDULE_EVENT,
      schedules: res.body
    });
  });
}

export function createSchedule(schedule, conferenceId) {
  let url = getUrl(conferenceId);
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
          actionType: CREATE_CONFERENCE_SCHEDULE_EVENT,
          schedule: res.body
        });
        // trigger refresh all schedules
        this.getSchedules(conferenceId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_CONFERENCE_SCHEDULE_EVENT,
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

export function saveSchedule(schedule, conferenceId) {
  let url = getUrl(conferenceId) + '/' + schedule._id;
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
          actionType: SAVE_CONFERENCE_SCHEDULE_EVENT,
          schedule: res.body
        });
        // trigger refresh all schedules
        this.getSchedules(conferenceId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_CONFERENCE_SCHEDULE_EVENT,
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

export function deleteSchedule(schedule, conferenceId) {
  let url = getUrl(conferenceId) + '/' + schedule._id;
  let token = UserStore.getToken();
  Request
    .del(url)
    .accept('application/json')
    .type('application/json')
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: DELETE_CONFERENCE_SCHEDULE_EVENT,
          schedule: res.body
        });
        // trigger refresh all schedules
        this.getSchedules(conferenceId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_DELETE_CONFERENCE_SCHEDULE_EVENT,
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

