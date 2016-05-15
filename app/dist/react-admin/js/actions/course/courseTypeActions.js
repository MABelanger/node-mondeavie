"use strict";

// Vendor modules
import Request                        from "superagent";

// Flux
import ClientDispatcher               from "../../dispatcher/clientDispatcher";
import CourseTypeConstants            from "../../constants/course/courseTypeConstants";
// Flux (to get token)
import UserStore                      from '../../stores/user/userStore';

const { BASE_URL,
        LIST_COURSE_TYPE_EVENT,
        CREATE_COURSE_TYPE_EVENT,
        SAVED_COURSE_TYPE_EVENT,
        READ_COURSE_TYPE_EVENT,
        SAVE_COURSE_TYPE_EVENT,
        DELETE_COURSE_TYPE_EVENT,
        ERROR_SAVE_COURSE_TYPE_EVENT,
        ERROR_DELETE_COURSE_TYPE_EVENT } = CourseTypeConstants;


function getFlatErrors(errors){
  let flatErrors = {};
  for (var property in errors) {
    if (errors.hasOwnProperty(property)) {
      // 'courseTypes.1.firstName' -> 'firstName'
      let newProperty = property.split('.').splice(-1);
      flatErrors[newProperty] = errors[ property ];
    }
  }
  return flatErrors;
}

function getUrl(courseId, teacherId){
  return BASE_URL + 'courses/' + courseId + '/teachers/' + teacherId + '/course_description/course_types'
}

export function getCourseTypes(courseId, teacherId) {
  let url = getUrl(courseId, teacherId);
  let token = UserStore.getToken();
  Request
  .get(url)
  .set('Authorization', 'Bearer ' + token)
  .end(function(err, res){
    ClientDispatcher.dispatch({
      actionType: LIST_COURSE_TYPE_EVENT,
      courseTypes: res.body
    });
  });
}

export function createCourseType(courseType, courseId, teacherId) {
  let url = getUrl(courseId, teacherId);
  let token = UserStore.getToken();
  Request
    .post(url)
    .accept('application/json')
    .type('application/json')
    .send(courseType)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: CREATE_COURSE_TYPE_EVENT,
          courseType: res.body
        });
        // trigger refresh all courseTypes
        this.getCourseTypes(courseId, teacherId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_COURSE_TYPE_EVENT,
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

export function saveCourseType(courseType, courseId, teacherId) {
  let url = getUrl(courseId, teacherId) + '/' + courseType._id;
  let token = UserStore.getToken();
  Request
    .put(url)
    .accept('application/json')
    .type('application/json')
    .send(courseType)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: SAVE_COURSE_TYPE_EVENT,
          courseType: res.body
        });
        // trigger refresh all courseTypes
        this.getCourseTypes(courseId, teacherId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_COURSE_TYPE_EVENT,
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

export function deleteCourseType(courseType, courseId, teacherId) {
  let url = getUrl(courseId, teacherId) + '/' + courseType._id;
  let token = UserStore.getToken();
  Request
    .del(url)
    .accept('application/json')
    .type('application/json')
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: DELETE_COURSE_TYPE_EVENT,
          courseType: res.body
        });
        // trigger refresh all courseTypes
        this.getCourseTypes(courseId, teacherId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_DELETE_COURSE_TYPE_EVENT,
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

