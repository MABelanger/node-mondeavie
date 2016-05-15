"use strict";

// Flux TeacherStore
import AppDispatcher                  from '../../dispatcher/clientDispatcher';
import TeacherConstants               from '../../constants/course/teacherConstants';
import { EventEmitter }               from 'events';

const { LIST_TEACHER_EVENT,
        CREATE_TEACHER_EVENT,
        SAVED_TEACHER_EVENT,
        READ_TEACHER_EVENT,
        SAVE_TEACHER_EVENT,

        DELETED_TEACHER_EVENT,
        ERROR_SAVE_TEACHER_EVENT,
        ERROR_DELETE_TEACHER_EVENT } = TeacherConstants;



// Define the public event listeners and getters that
// the views will use to listen for changes and retrieve
// the store
class TeacherStoreClass extends EventEmitter {

  constructor() {
    super();
    this.teachers = [];
    this.teacher = {};
    this.errors = {};
  }

  /* 
   * public methods
   */
  setTeachers(teachers){
    this.teachers = teachers;
  }

  setTeacher(teacher){
    this.teacher = teacher;
  }

  setErrors(errors){
    this.errors = errors;
  }  

  getTeachers(){
    return this.teachers;
  }

  getTeacher(){
    return this.teacher;
  }

  getErrors(){
    return this.errors;
  }

  /*
   * LIST
   */
  addListListener(cb) {
    this.on(LIST_TEACHER_EVENT, cb);
  }
  removeListListener(cb) {
    this.removeListener(LIST_TEACHER_EVENT, cb);
  }
  emitList(){
    this.emit(LIST_TEACHER_EVENT);
  }


  /*
   * Create
   */
  addCreateListener(cb) {
    this.on(CREATE_TEACHER_EVENT, cb);
  }
  removeCreateListener(cb) {
    this.removeCreateListener(CREATE_TEACHER_EVENT, cb);
  }
  emitCreate(){
    this.emit(CREATE_TEACHER_EVENT);
  }


  /*
   * Read
   */
  addReadListener(cb) {
    this.on(READ_TEACHER_EVENT, cb);
  }
  removeReadListener(cb) {
    this.removeListener(READ_TEACHER_EVENT, cb);
  }
  emitRead(){
    this.emit(READ_TEACHER_EVENT);
  }

  /*
   * Saved
   */
  addSavedListener(cb) {
    this.on(SAVED_TEACHER_EVENT, cb);
  }
  removeSavedListener(cb) {
    this.removeListener(SAVED_TEACHER_EVENT, cb);
  }
  emitSaved(){
    this.emit(SAVED_TEACHER_EVENT);
  }

  /*
   * Deleted
   */
  addDeletedListener(cb) {
    this.on(DELETED_TEACHER_EVENT, cb);
  }
  removeDeletedListener(cb) {
    this.removeListener(DELETED_TEACHER_EVENT, cb);
  }
  emitDeleted(){
    this.emit(DELETED_TEACHER_EVENT);
  }

  /*
   * Error
   */
  addErrorListener(cb) {
    this.on(ERROR_SAVE_TEACHER_EVENT, cb);
  }
  removeErrorListener(cb) {
    this.removeListener(ERROR_SAVE_TEACHER_EVENT, cb);
  }
  emitError(){
    this.emit(ERROR_SAVE_TEACHER_EVENT);
  }

}



// Initialize the singleton to register with the
// dispatcher and export for React components
const teacherStore = new TeacherStoreClass();

// Register each of the actions with the dispatcher
// by changing the store's data and emitting a
// change
AppDispatcher.register((payload) => {
  switch (payload.actionType) {

  case TeacherConstants.LIST_TEACHER_EVENT:
    teacherStore.setTeachers(payload.teachers);
    teacherStore.emitList();
    break;

  case TeacherConstants.CREATE_TEACHER_EVENT:
    teacherStore.setTeacher(payload.teacher);
    teacherStore.emitSaved();
    break;

  case TeacherConstants.SAVE_TEACHER_EVENT:
    teacherStore.setTeacher(payload.teacher);
    teacherStore.emitSaved();
    break;

  case TeacherConstants.DELETE_TEACHER_EVENT:
    teacherStore.setTeacher({});
    teacherStore.emitDeleted();
    break;

  case TeacherConstants.ERROR_SAVE_TEACHER_EVENT:
    teacherStore.setErrors(payload.errors);
    teacherStore.emitError();
    break;

  default:
    return true;
  }
});

export default teacherStore;
