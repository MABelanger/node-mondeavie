"use strict";

// Vendor modules
import Request                        from "superagent";

// Flux
import ClientDispatcher               from "../../dispatcher/clientDispatcher";
import TeacherConstants               from "../../constants/course/teacherConstants";
// Flux (to get token)
import UserStore                      from '../../stores/user/userStore';

const { BASE_URL,
        LIST_TEACHER_EVENT,
        CREATE_TEACHER_EVENT,
        SAVED_TEACHER_EVENT,
        READ_TEACHER_EVENT,
        SAVE_TEACHER_EVENT,
        DELETE_TEACHER_EVENT,
        ERROR_SAVE_TEACHER_EVENT,
        ERROR_DELETE_TEACHER_EVENT } = TeacherConstants;


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


export function getTeachers(courseId) {
  let url = BASE_URL + 'courses/' + courseId + '/teachers/';
  let token = UserStore.getToken();
  Request
  .get(url)
  .set('Authorization', 'Bearer ' + token)
  .end(function(err, res){
    ClientDispatcher.dispatch({
      actionType: LIST_TEACHER_EVENT,
      teachers: res.body
    });
  });
}

export function createTeacher(teacher, courseId) {
  let url = BASE_URL + 'courses/' + courseId + '/teachers/';
  let token = UserStore.getToken();
  Request
    .post(url)
    .accept('application/json')
    .type('application/json')
    .send(teacher)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: CREATE_TEACHER_EVENT,
          teacher: res.body
        });
        // trigger refresh all teachers
        this.getTeachers(courseId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_TEACHER_EVENT,
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

export function saveTeacher(teacher, courseId) {
  let token = UserStore.getToken();
  let url = BASE_URL + 'courses/' + courseId + '/teachers/' + teacher._id;
  Request
    .put(url)
    .accept('application/json')
    .type('application/json')
    .send(teacher)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: SAVE_TEACHER_EVENT,
          teacher: res.body
        });
        // trigger refresh all teachers
        this.getTeachers(courseId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_TEACHER_EVENT,
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

export function deleteTeacher(teacher, courseId) {
  let token = UserStore.getToken();
  let url = BASE_URL + 'courses/' + courseId + '/teachers/' + teacher._id;
  Request
    .del(url)
    .accept('application/json')
    .type('application/json')
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: DELETE_TEACHER_EVENT,
          teacher: res.body
        });
        // trigger refresh all teachers
        this.getTeachers(courseId);
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_DELETE_TEACHER_EVENT,
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

