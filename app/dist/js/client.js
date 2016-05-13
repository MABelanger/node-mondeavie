"use strict";

// Vendor modules
import React                          from "react";
import ReactDOM                       from "react-dom";
import { createHistory }              from 'history';
import { Router, Route, IndexRoute, Redirect,
  hashHistory, useRouterHistory }       from "react-router";

// Project modules
import Layout from './pages/Layout';
import CalendarPage from './pages/calendar/CalendarPage';
import CourseTeacherPage from './pages/calendar/CourseTeacherPage';
import ReservationCoursePage from './pages/calendar/ReservationCoursePage';
import ConferencesPage from './pages/conference/ConferencesPage';
import ConferenceDetailPage from './pages/conference/ConferenceDetailPage';
import ReservationConferencePage from './pages/conference/ReservationConferencePage';

const browserHistory = useRouterHistory(createHistory)({ basename: '/' })
const APP = document.getElementById('app');

ReactDOM.render(
  <Router history={browserHistory}>
    <Redirect from="/" to="calendrier/cours/" />
    <Route  path="/"
            component={Layout}>

      <Route path = "calendrier/cours/"
              name="calendarPage"
              component={CalendarPage}>
      </Route>
      <Route  path="calendrier/cours/:courseNameSlug/:teacherSlug"
              name="courseTeacherPage"
              component={CourseTeacherPage}>
      </Route>
      <Route  path="reservation/cours/:courseNameSlug/:teacherSlug/:courseTypeSlug/:weekDayNameSlug/:hourStartSlug-:hourEndSlug"
              name="reservationPage"
              component={ReservationCoursePage}>
      </Route>
      <Route  path="conferences"
              name="conferencePage"
              component={ConferencesPage}>
      </Route>
      <Route  path="conferences/detail/:conferenceSlug/:speakerSlug"
              name="conferenceDetailPage"
              component={ConferenceDetailPage}>
      </Route>
      
      <Route  path="reservation/conference/:conferenceSlug/:speakerSlug/:dateSlug/:hourStartSlug"
              name="conferenceDetailPage"
              component={ReservationConferencePage}>
      </Route>
    </Route>
  </Router>,APP);
// 
