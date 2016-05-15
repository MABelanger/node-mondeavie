"use strict";

// Flux CourseDescriptionStore
import AppDispatcher                  from '../../dispatcher/clientDispatcher';
import CourseDescriptionConstants               from '../../constants/course/courseDescriptionConstants';
import { EventEmitter }               from 'events';

const { GET_COURSE_DESCRIPTION_EVENT,
        CREATE_COURSE_DESCRIPTION_EVENT,
        SAVED_COURSE_DESCRIPTION_EVENT,
        READ_COURSE_DESCRIPTION_EVENT,
        SAVE_COURSE_DESCRIPTION_EVENT,

        DELETED_COURSE_DESCRIPTION_EVENT,
        ERROR_SAVE_COURSE_DESCRIPTION_EVENT,
        ERROR_DELETE_COURSE_DESCRIPTION_EVENT } = CourseDescriptionConstants;



// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class CourseDescriptionStoreClass extends EventEmitter {

  constructor() {
    super();
    this.courseDescriptions = [];
    this.courseDescription = {};
    this.errors = {};
  }

  /* 
   * public methods
   */
  setCourseDescriptions(courseDescriptions){
    this.courseDescriptions = courseDescriptions;
  }

  setCourseDescription(courseDescription){
    this.courseDescription = courseDescription;
  }

  setErrors(errors){
    this.errors = errors;
  }  


  getCourseDescription(){
    return this.courseDescription;
  }

  getErrors(){
    return this.errors;
  }

  /*
   * Create
   */
  addCreateListener(cb) {
    this.on(CREATE_COURSE_DESCRIPTION_EVENT, cb);
  }
  removeCreateListener(cb) {
    this.removeCreateListener(CREATE_COURSE_DESCRIPTION_EVENT, cb);
  }
  emitCreate(){
    this.emit(CREATE_COURSE_DESCRIPTION_EVENT);
  }


  /*
   * Read
   */
  addReadListener(cb) {
    this.on(GET_COURSE_DESCRIPTION_EVENT, cb);
  }
  removeReadListener(cb) {
    this.removeListener(GET_COURSE_DESCRIPTION_EVENT, cb);
  }
  emitRead(){
    this.emit(GET_COURSE_DESCRIPTION_EVENT);
  }

  /*
   * Saved
   */
  addSavedListener(cb) {
    this.on(SAVED_COURSE_DESCRIPTION_EVENT, cb);
  }
  removeSavedListener(cb) {
    this.removeListener(SAVED_COURSE_DESCRIPTION_EVENT, cb);
  }
  emitSaved(){
    this.emit(SAVED_COURSE_DESCRIPTION_EVENT);
  }

  /*
   * Deleted
   */
  addDeletedListener(cb) {
    this.on(DELETED_COURSE_DESCRIPTION_EVENT, cb);
  }
  removeDeletedListener(cb) {
    this.removeListener(DELETED_COURSE_DESCRIPTION_EVENT, cb);
  }
  emitDeleted(){
    this.emit(DELETED_COURSE_DESCRIPTION_EVENT);
  }

  /*
   * Error
   */
  addErrorListener(cb) {
    this.on(ERROR_SAVE_COURSE_DESCRIPTION_EVENT, cb);
  }
  removeErrorListener(cb) {
    this.removeListener(ERROR_SAVE_COURSE_DESCRIPTION_EVENT, cb);
  }
  emitError(){
    this.emit(ERROR_SAVE_COURSE_DESCRIPTION_EVENT);
  }

}



// Initialize the singleton to register with the
// dispatcher and export for React components
const courseDescriptionStore = new CourseDescriptionStoreClass();

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a
// change
AppDispatcher.register((payload) => {
  switch (payload.actionType) {

  case CourseDescriptionConstants.GET_COURSE_DESCRIPTION_EVENT:
    courseDescriptionStore.setCourseDescription(payload.courseDescription);
    courseDescriptionStore.emitRead();
    break;

  case CourseDescriptionConstants.CREATE_COURSE_DESCRIPTION_EVENT:
    courseDescriptionStore.setCourseDescription(payload.courseDescription);
    courseDescriptionStore.emitSaved();
    break;

  case CourseDescriptionConstants.SAVE_COURSE_DESCRIPTION_EVENT:
    courseDescriptionStore.setCourseDescription(payload.courseDescription);
    courseDescriptionStore.emitSaved();
    break;

  case CourseDescriptionConstants.DELETE_COURSE_DESCRIPTION_EVENT:
    courseDescriptionStore.setCourseDescription({});
    courseDescriptionStore.emitDeleted();
    break;

  case CourseDescriptionConstants.ERROR_SAVE_COURSE_DESCRIPTION_EVENT:
    courseDescriptionStore.setErrors(payload.errors);
    courseDescriptionStore.emitError();
    break;

  default:
    return true;
  }
});

export default courseDescriptionStore;
