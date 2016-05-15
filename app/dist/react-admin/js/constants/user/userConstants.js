'use strict';

import keyMirror from 'keymirror';

var BASE_URL = 'http://localhost:3000/';
// User constants
export default {
  BASE_URL: BASE_URL,
  LOGIN_URL: BASE_URL + 'public/api/sessions/authentication',
  SEND_LOGIN: 'SEND_LOGIN',
  DONE_LOGIN: 'DONE_LOGIN',
  CHANGE_EVENT: 'CHANGE_EVENT'
};