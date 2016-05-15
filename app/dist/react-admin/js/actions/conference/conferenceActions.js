"use strict";

// Vendor modules
import Request                        from "superagent";

// Flux
import ClientDispatcher               from "../../dispatcher/clientDispatcher";
import ConferenceConstants            from "../../constants/conference/conferenceConstants";
// Flux (to get token)
import UserStore                      from '../../stores/user/userStore';

const { URL,
        LIST_CONFERENCE_EVENT,
        CREATE_CONFERENCE_EVENT,
        SAVED_CONFERENCE_EVENT,
        READ_CONFERENCE_EVENT,
        SAVE_CONFERENCE_EVENT,
        DELETE_CONFERENCE_EVENT,
        ERROR_SAVE_CONFERENCE_EVENT,
        ERROR_DELETE_CONFERENCE_EVENT } = ConferenceConstants;


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


export function getConferences() {
  let token = UserStore.getToken();
  Request
  .get(URL)
  .set('Authorization', 'Bearer ' + token)
  .end(function(err, res){
    ClientDispatcher.dispatch({
      actionType: LIST_CONFERENCE_EVENT,
      conferences: res.body
    });
  });
}

export function createConference(conference) {
  let token = UserStore.getToken();
  Request
    .post(URL)
    .accept('application/json')
    .type('application/json')
    .send(conference)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: CREATE_CONFERENCE_EVENT,
          conference: res.body
        });
        // trigger refresh all conferences
        this.getConferences();
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_CONFERENCE_EVENT,
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

export function saveConference(conference) {
  let token = UserStore.getToken();
  let url = URL + '/' + conference._id;
  Request
    .put(url)
    .accept('application/json')
    .type('application/json')
    .send(conference)
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: SAVE_CONFERENCE_EVENT,
          conference: res.body
        });
        // trigger refresh all conferences
        this.getConferences();
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_SAVE_CONFERENCE_EVENT,
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

export function deleteConference(conference) {
  let token = UserStore.getToken();
  let url = URL + '/' + conference._id;
  Request
    .del(url)
    .accept('application/json')
    .type('application/json')
    .set('Authorization', 'Bearer ' + token)
    .end((err, res) => {
      if (! err ) {
        ClientDispatcher.dispatch({
          actionType: DELETE_CONFERENCE_EVENT,
          conference: res.body
        });
        // trigger refresh all conferences
        this.getConferences();
      }
      else {
        if(res) {
          ClientDispatcher.dispatch({
            actionType: ERROR_DELETE_CONFERENCE_EVENT,
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

