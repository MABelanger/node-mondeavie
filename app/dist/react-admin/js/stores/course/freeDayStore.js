"use strict";

// Flux FreeDayStore
import AppDispatcher                  from '../../dispatcher/clientDispatcher';
import FreeDayConstants               from '../../constants/course/freeDayConstants';
import { EventEmitter }               from 'events';

const { LIST_FREE_DAY_EVENT,
        CREATE_FREE_DAY_EVENT,
        SAVED_FREE_DAY_EVENT,
        READ_FREE_DAY_EVENT,
        SAVE_FREE_DAY_EVENT,

        DELETED_FREE_DAY_EVENT,
        ERROR_SAVE_FREE_DAY_EVENT,
        ERROR_DELETE_FREE_DAY_EVENT } = FreeDayConstants;



// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class FreeDayStoreClass extends EventEmitter {

  constructor() {
    super();
    this.freeDays = [];
    this.freeDay = {};
    this.errors = {};
  }

  /* 
   * public methods
   */
  setFreeDays(freeDays){
    this.freeDays = freeDays;
  }

  setFreeDay(freeDay){
    this.freeDay = freeDay;
  }

  setErrors(errors){
    this.errors = errors;
  }  

  getFreeDays(){
    return this.freeDays;
  }

  getFreeDay(){
    return this.freeDay;
  }

  getErrors(){
    return this.errors;
  }

  /*
   * LIST
   */
  addListListener(cb) {
    this.on(LIST_FREE_DAY_EVENT, cb);
  }
  removeListListener(cb) {
    this.removeListener(LIST_FREE_DAY_EVENT, cb);
  }
  emitList(){
    this.emit(LIST_FREE_DAY_EVENT);
  }


  /*
   * Create
   */
  addCreateListener(cb) {
    this.on(CREATE_FREE_DAY_EVENT, cb);
  }
  removeCreateListener(cb) {
    this.removeCreateListener(CREATE_FREE_DAY_EVENT, cb);
  }
  emitCreate(){
    this.emit(CREATE_FREE_DAY_EVENT);
  }


  /*
   * Read
   */
  addReadListener(cb) {
    this.on(READ_FREE_DAY_EVENT, cb);
  }
  removeReadListener(cb) {
    this.removeListener(READ_FREE_DAY_EVENT, cb);
  }
  emitRead(){
    this.emit(READ_FREE_DAY_EVENT);
  }

  /*
   * Saved
   */
  addSavedListener(cb) {
    this.on(SAVED_FREE_DAY_EVENT, cb);
  }
  removeSavedListener(cb) {
    this.removeListener(SAVED_FREE_DAY_EVENT, cb);
  }
  emitSaved(){
    this.emit(SAVED_FREE_DAY_EVENT);
  }

  /*
   * Deleted
   */
  addDeletedListener(cb) {
    this.on(DELETED_FREE_DAY_EVENT, cb);
  }
  removeDeletedListener(cb) {
    this.removeListener(DELETED_FREE_DAY_EVENT, cb);
  }
  emitDeleted(){
    this.emit(DELETED_FREE_DAY_EVENT);
  }

  /*
   * Error
   */
  addErrorListener(cb) {
    this.on(ERROR_SAVE_FREE_DAY_EVENT, cb);
  }
  removeErrorListener(cb) {
    this.removeListener(ERROR_SAVE_FREE_DAY_EVENT, cb);
  }
  emitError(){
    this.emit(ERROR_SAVE_FREE_DAY_EVENT);
  }

}



// Initialize the singleton to register with the
// dispatcher and export for React components
const freeDayStore = new FreeDayStoreClass();

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a
// change
AppDispatcher.register((payload) => {
  switch (payload.actionType) {

  case FreeDayConstants.LIST_FREE_DAY_EVENT:
    freeDayStore.setFreeDays(payload.freeDays);
    freeDayStore.emitList();
    break;

  case FreeDayConstants.CREATE_FREE_DAY_EVENT:
    freeDayStore.setFreeDay(payload.freeDay);
    freeDayStore.emitSaved();
    break;

  case FreeDayConstants.SAVE_FREE_DAY_EVENT:
    freeDayStore.setFreeDay(payload.freeDay);
    freeDayStore.emitSaved();
    break;

  case FreeDayConstants.DELETE_FREE_DAY_EVENT:
    freeDayStore.setFreeDay({});
    freeDayStore.emitDeleted();
    break;

  case FreeDayConstants.ERROR_SAVE_FREE_DAY_EVENT:
    freeDayStore.setErrors(payload.errors);
    freeDayStore.emitError();
    break;

  default:
    return true;
  }
});

export default freeDayStore;
