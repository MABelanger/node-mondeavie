"use strict";

// Vendor modules
import React                          from "react";
import ReactDOM                       from "react-dom";
import { Router, Route, IndexRoute,
  hashHistory, browserHistory }       from "react-router";

// Project modules
import Layout                         from './pages/Layout';
import ConferenceAdminPage            from './pages/ConferenceAdminPage';
import CourseAdminPage                from './pages/CourseAdminPage';
import LoginPage                      from './pages/LoginPage';

const APP = document.getElementById('app');
ReactDOM.render(
  <Router history={hashHistory}>
    <Route  path="/"
            component={Layout}>
      <IndexRoute
              name="courseAdminPage"
              component={CourseAdminPage}>
      </IndexRoute>

      <Route  path="/admin/login"
              name="loginPage"
              component={LoginPage}>
      </Route>

      <Route  path="/admin/course"
              name="courseAdminPage"
              component={CourseAdminPage}>
      </Route>

      <Route  path="/admin/conference"
              name="conferenceAdminPage"
              component={ConferenceAdminPage}>
      </Route>

    </Route>
  </Router>,APP);

