'use strict';

let BASE_URL = 'http://localhost:3000/api/';

export default {
  BASE_URL: BASE_URL,
  CREATE_COURSE_TYPE_EVENT: 'CREATE_COURSE_TYPE_EVENT',
  READ_COURSE_TYPE_EVENT: 'READ_COURSE_TYPE_EVENT',
  SAVE_COURSE_TYPE_EVENT: 'SAVE_COURSE_TYPE_EVENT',
  DELETE_COURSE_TYPE_EVENT: 'DELETE_COURSE_TYPE_EVENT',
  LIST_COURSE_TYPE_EVENT: 'LIST_COURSE_TYPE_EVENT',

  // trigger when success or errors
  SAVED_COURSE_TYPE_EVENT: 'SAVED_COURSE_TYPE_EVENT',
  DELETED_COURSE_TYPE_EVENT: 'DELETED_COURSE_TYPE_EVENT',
  ERROR_SAVE_COURSE_TYPE_EVENT: 'ERROR_SAVE_COURSE_TYPE_EVENT',
  ERROR_DELETE_COURSE_TYPE_EVENT: 'ERROR_DELETE_COURSE_TYPE_EVENT'
};