"use strict";

// Flux ConferenceStore
import AppDispatcher                  from '../../dispatcher/clientDispatcher';
import ConferenceConstants            from '../../constants/conference/conferenceConstants';
import { EventEmitter }               from 'events';

const { LIST_CONFERENCE_EVENT,
        CREATE_CONFERENCE_EVENT,
        SAVED_CONFERENCE_EVENT,
        READ_CONFERENCE_EVENT,
        SAVE_CONFERENCE_EVENT,

        DELETED_CONFERENCE_EVENT,
        ERROR_SAVE_CONFERENCE_EVENT,
        ERROR_DELETE_CONFERENCE_EVENT } = ConferenceConstants;



// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class ConferenceStoreClass extends EventEmitter {

  constructor() {
    super();
    this.conferences = [];
    this.conference = {};
    this.errors = {};
  }

  /* 
   * public methods
   */
  setConferences(conferences){
    this.conferences = conferences;
  }

  setConference(conference){
    this.conference = conference;
  }

  setErrors(errors){
    this.errors = errors;
  }  

  getConferences(){
    return this.conferences;
  }

  getConference(){
    return this.conference;
  }

  getErrors(){
    return this.errors;
  }

  /*
   * LIST
   */
  addListListener(cb) {
    this.on(LIST_CONFERENCE_EVENT, cb);
  }
  removeListListener(cb) {
    this.removeListener(LIST_CONFERENCE_EVENT, cb);
  }
  emitList(){
    this.emit(LIST_CONFERENCE_EVENT);
  }


  /*
   * Create
   */
  addCreateListener(cb) {
    this.on(CREATE_CONFERENCE_EVENT, cb);
  }
  removeCreateListener(cb) {
    this.removeCreateListener(CREATE_CONFERENCE_EVENT, cb);
  }
  emitCreate(){
    this.emit(CREATE_CONFERENCE_EVENT);
  }


  /*
   * Read
   */
  addReadListener(cb) {
    this.on(READ_CONFERENCE_EVENT, cb);
  }
  removeReadListener(cb) {
    this.removeListener(READ_CONFERENCE_EVENT, cb);
  }
  emitRead(){
    this.emit(READ_CONFERENCE_EVENT);
  }



  /*
   * Saved
   */
  addSavedListener(cb) {
    this.on(SAVED_CONFERENCE_EVENT, cb);
  }
  removeSavedListener(cb) {
    this.removeListener(SAVED_CONFERENCE_EVENT, cb);
  }
  emitSaved(){
    this.emit(SAVED_CONFERENCE_EVENT);
  }

  /*
   * Deleted
   */
  addDeletedListener(cb) {
    this.on(DELETED_CONFERENCE_EVENT, cb);
  }
  removeDeletedListener(cb) {
    this.removeListener(DELETED_CONFERENCE_EVENT, cb);
  }
  emitDeleted(){
    this.emit(DELETED_CONFERENCE_EVENT);
  }

  /*
   * Error
   */
  addErrorListener(cb) {
    this.on(ERROR_SAVE_CONFERENCE_EVENT, cb);
  }
  removeErrorListener(cb) {
    this.removeListener(ERROR_SAVE_CONFERENCE_EVENT, cb);
  }
  emitError(){
    this.emit(ERROR_SAVE_CONFERENCE_EVENT);
  }

}



// Initialize the singleton to register with the
// dispatcher and export for React components
const conferenceStore = new ConferenceStoreClass();

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a
// change
AppDispatcher.register((payload) => {
  switch (payload.actionType) {    

  case ConferenceConstants.LIST_CONFERENCE_EVENT:
    conferenceStore.setConferences(payload.conferences);
    conferenceStore.emitList();
    break;

  case ConferenceConstants.CREATE_CONFERENCE_EVENT:
    conferenceStore.setConference(payload.conference);
    conferenceStore.emitSaved();
    break;

  case ConferenceConstants.SAVE_CONFERENCE_EVENT:
    conferenceStore.setConference(payload.conference);
    conferenceStore.emitSaved();
    break;

  case ConferenceConstants.DELETE_CONFERENCE_EVENT:
    conferenceStore.setConference({});
    conferenceStore.emitDeleted();
    break;

  case ConferenceConstants.ERROR_SAVE_CONFERENCE_EVENT:
    conferenceStore.setErrors(payload.errors);
    conferenceStore.emitError();
    break;

  default:
    return true;
  }
});

export default conferenceStore;
