"use strict";

// Flux CourseTypeStore
import AppDispatcher                  from '../../dispatcher/clientDispatcher';
import CourseTypeConstants               from '../../constants/course/courseTypeConstants';
import { EventEmitter }               from 'events';

const { LIST_COURSE_TYPE_EVENT,
        CREATE_COURSE_TYPE_EVENT,
        SAVED_COURSE_TYPE_EVENT,
        READ_COURSE_TYPE_EVENT,
        SAVE_COURSE_TYPE_EVENT,

        DELETED_COURSE_TYPE_EVENT,
        ERROR_SAVE_COURSE_TYPE_EVENT,
        ERROR_DELETE_COURSE_TYPE_EVENT } = CourseTypeConstants;



// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class CourseTypeStoreClass extends EventEmitter {

  constructor() {
    super();
    this.courseTypes = [];
    this.courseType = {};
    this.errors = {};
  }

  /* 
   * public methods
   */
  setCourseTypes(courseTypes){
    this.courseTypes = courseTypes;
  }

  setCourseType(courseType){
    this.courseType = courseType;
  }

  setErrors(errors){
    this.errors = errors;
  }  

  getCourseTypes(){
    return this.courseTypes;
  }

  getCourseType(){
    return this.courseType;
  }

  getErrors(){
    return this.errors;
  }

  /*
   * LIST
   */
  addListListener(cb) {
    this.on(LIST_COURSE_TYPE_EVENT, cb);
  }
  removeListListener(cb) {
    this.removeListener(LIST_COURSE_TYPE_EVENT, cb);
  }
  emitList(){
    this.emit(LIST_COURSE_TYPE_EVENT);
  }


  /*
   * Create
   */
  addCreateListener(cb) {
    this.on(CREATE_COURSE_TYPE_EVENT, cb);
  }
  removeCreateListener(cb) {
    this.removeCreateListener(CREATE_COURSE_TYPE_EVENT, cb);
  }
  emitCreate(){
    this.emit(CREATE_COURSE_TYPE_EVENT);
  }


  /*
   * Read
   */
  addReadListener(cb) {
    this.on(READ_COURSE_TYPE_EVENT, cb);
  }
  removeReadListener(cb) {
    this.removeListener(READ_COURSE_TYPE_EVENT, cb);
  }
  emitRead(){
    this.emit(READ_COURSE_TYPE_EVENT);
  }

  /*
   * Saved
   */
  addSavedListener(cb) {
    this.on(SAVED_COURSE_TYPE_EVENT, cb);
  }
  removeSavedListener(cb) {
    this.removeListener(SAVED_COURSE_TYPE_EVENT, cb);
  }
  emitSaved(){
    this.emit(SAVED_COURSE_TYPE_EVENT);
  }

  /*
   * Deleted
   */
  addDeletedListener(cb) {
    this.on(DELETED_COURSE_TYPE_EVENT, cb);
  }
  removeDeletedListener(cb) {
    this.removeListener(DELETED_COURSE_TYPE_EVENT, cb);
  }
  emitDeleted(){
    this.emit(DELETED_COURSE_TYPE_EVENT);
  }

  /*
   * Error
   */
  addErrorListener(cb) {
    this.on(ERROR_SAVE_COURSE_TYPE_EVENT, cb);
  }
  removeErrorListener(cb) {
    this.removeListener(ERROR_SAVE_COURSE_TYPE_EVENT, cb);
  }
  emitError(){
    this.emit(ERROR_SAVE_COURSE_TYPE_EVENT);
  }

}



// Initialize the singleton to register with the
// dispatcher and export for React components
const courseTypeStore = new CourseTypeStoreClass();

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a
// change
AppDispatcher.register((payload) => {
  switch (payload.actionType) {

  case CourseTypeConstants.LIST_COURSE_TYPE_EVENT:
    courseTypeStore.setCourseTypes(payload.courseTypes);
    courseTypeStore.emitList();
    break;

  case CourseTypeConstants.CREATE_COURSE_TYPE_EVENT:
    courseTypeStore.setCourseType(payload.courseType);
    courseTypeStore.emitSaved();
    break;

  case CourseTypeConstants.SAVE_COURSE_TYPE_EVENT:
    courseTypeStore.setCourseType(payload.courseType);
    courseTypeStore.emitSaved();
    break;

  case CourseTypeConstants.DELETE_COURSE_TYPE_EVENT:
    courseTypeStore.setCourseType({});
    courseTypeStore.emitDeleted();
    break;

  case CourseTypeConstants.ERROR_SAVE_COURSE_TYPE_EVENT:
    courseTypeStore.setErrors(payload.errors);
    courseTypeStore.emitError();
    break;

  default:
    return true;
  }
});

export default courseTypeStore;
