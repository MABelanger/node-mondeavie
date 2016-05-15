"use strict";

// Vendor modules
import Request                        from "superagent";

// Flux
import ClientDispatcher               from "../../dispatcher/clientDispatcher";
import FreeDayConstants               from "../../constants/course/freeDayConstants";

// Flux (to get token)
import UserStore                      from '../../stores/user/userStore';

const { BASE_URL,
        LIST_FREE_DAY_EVENT,
        CREATE_FREE_DAY_EVENT,
        SAVED_FREE_DAY_EVENT,
        READ_FREE_DAY_EVENT,
        SAVE_FREE_DAY_EVENT,
        DELETE_FREE_DAY_EVENT,
        ERROR_SAVE_FREE_DAY_EVENT,
        ERROR_DELETE_FREE_DAY_EVENT } = FreeDayConstants;


function getFlatErrors(errors){
  let flatErrors = {};
  for (var property in errors) {
    if (errors.hasOwnProperty(property)) {
      // 'freeDays.1.firstName' -> 'firstName'
      let newProperty = property.split('.').splice(-1);
      flatErrors[newProperty] = errors[ property ];
    }
  }
  return flatErrors;
}

function getUrl(courseId, teacherId, courseTypeId, scheduleId){
  return BASE_URL + 'courses/' + courseId 
                  + '/teachers/' + teacherId 
                  + '/course_description/course_types/' + courseTypeId
                  + '/schedules/' + scheduleId
                  + '/free_days';
}

export function getFreeDays(courseId, teacherId, courseTypeId, scheduleId) {
  let url = getUrl(courseId, teacherId, courseTypeId, scheduleId);
  let token = UserStore.getToken();
  Request
  .get(url)
  .set('Authorization', 'Bearer ' + token)
  .end(function(err, res){
    ClientDispatcher.dispatch({
      actionType: LIST_FREE_DAY_EVENT,
      freeDays: res.body
    });
  });
}

export function createFreeDay(freeDay, courseId, teacherId, courseTypeId, scheduleId) {
  let url = getUrl(courseId, teacherId, courseTypeId, scheduleId);
  let token = UserStore.getToken();
  Request
    .post(url)
    .accept('application/json')
    .type('application/json')
    .send(freeDay)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: CREATE_FREE_DAY_EVENT,
          freeDay: res.body
        });
        // trigger refresh all freeDays
        this.getFreeDays(courseId, teacherId, courseTypeId, scheduleId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_FREE_DAY_EVENT,
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

export function saveFreeDay(freeDay, courseId, teacherId, courseTypeId, scheduleId) {
  let url = getUrl(courseId, teacherId, courseTypeId, scheduleId) + '/' + freeDay._id;
  let token = UserStore.getToken();
  Request
    .put(url)
    .accept('application/json')
    .type('application/json')
    .send(freeDay)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: SAVE_FREE_DAY_EVENT,
          freeDay: res.body
        });
        // trigger refresh all freeDays
        this.getFreeDays(courseId, teacherId, courseTypeId, scheduleId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_FREE_DAY_EVENT,
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

export function deleteFreeDay(freeDay, courseId, teacherId, courseTypeId, scheduleId) {
  let url = getUrl(courseId, teacherId, courseTypeId, scheduleId) + '/' + freeDay._id;
  let token = UserStore.getToken();
  Request
    .del(url)
    .accept('application/json')
    .type('application/json')
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: DELETE_FREE_DAY_EVENT,
          freeDay: res.body
        });
        // trigger refresh all freeDays
        this.getFreeDays(courseId, teacherId, courseTypeId, scheduleId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_DELETE_FREE_DAY_EVENT,
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

