"use strict";
import jwt_decode                     from 'jwt-decode';

// Flux CourseStore
import AppDispatcher                  from '../../dispatcher/clientDispatcher';
import UserConstants                  from '../../constants/user/userConstants';
import { EventEmitter }               from 'events';

const CHANGE_EVENT = UserConstants.CHANGE_EVENT;

// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class UserStoreClass extends EventEmitter {

  constructor() {
    super();
    this.data = null;
    this.user = null;
    this.token = null;
  }

  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }

  emitChange(){
    this.emit(CHANGE_EVENT);
  }

  doneUser(data){
    this.data = data;
    this.token = data.id_token;
    this.user = jwt_decode(data.id_token);
  }

  getData(){
    return this.data;
  }

  getUser(){
    return this.user;
  }

  getToken(){
    return this.token;
  }
}

// Initialize the singleton to register with the
// dispatcher and export for React components
const userStore = new UserStoreClass();

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a
// change
AppDispatcher.register((payload) => {
  switch (payload.actionType) {

  case UserConstants.DONE_LOGIN:
    userStore.doneUser(payload.data);
    userStore.emit(CHANGE_EVENT);
    break;

  default:
    return true;
  }
});

export default userStore;
