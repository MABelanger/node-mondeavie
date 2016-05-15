"use strict";

// Vendor modules
import Request                        from "superagent";

// Flux
import ClientDispatcher               from "../../dispatcher/clientDispatcher";
import CourseNameConstants            from "../../constants/course/courseNameConstants";
// Flux (to get token)
import UserStore                      from '../../stores/user/userStore';

const { URL,
        LIST_COURSE_NAME_EVENT,
        CREATE_COURSE_NAME_EVENT,
        SAVED_COURSE_NAME_EVENT,
        READ_COURSE_NAME_EVENT,
        SAVE_COURSE_NAME_EVENT,
        DELETE_COURSE_NAME_EVENT,
        ERROR_SAVE_COURSE_NAME_EVENT,
        ERROR_DELETE_COURSE_NAME_EVENT } = CourseNameConstants;


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


export function getCourseNames() {
  let token = UserStore.getToken();
  Request
  .get(URL)
  .set('Authorization', 'Bearer ' + token)
  .end(function(err, res){
    ClientDispatcher.dispatch({
      actionType: LIST_COURSE_NAME_EVENT,
      courseNames: res.body
    });
  });
}

export function createCourseName(courseName) {
  let token = UserStore.getToken();
  Request
    .post(URL)
    .accept('application/json')
    .type('application/json')
    .send(courseName)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: CREATE_COURSE_NAME_EVENT,
          courseName: res.body
        });
        // trigger refresh all courseNames
        this.getCourseNames();
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_COURSE_NAME_EVENT,
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

export function saveCourseName(courseName) {
  let token = UserStore.getToken();
  let url = URL + '/' + courseName._id;
  Request
    .put(url)
    .accept('application/json')
    .type('application/json')
    .send(courseName)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: SAVE_COURSE_NAME_EVENT,
          courseName: res.body
        });
        // trigger refresh all courseNames
        this.getCourseNames();
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_COURSE_NAME_EVENT,
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

export function deleteCourseName(courseName) {
  let token = UserStore.getToken();
  let url = URL + '/' + courseName._id;
  Request
    .del(url)
    .accept('application/json')
    .type('application/json')
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: DELETE_COURSE_NAME_EVENT,
          courseName: res.body
        });
        // trigger refresh all courseNames
        this.getCourseNames();
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_DELETE_COURSE_NAME_EVENT,
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

