"use strict";
import React                          from "react";

import CourseAdmin                    from "../components/sections/course/admin";
import * as CourseNameActions         from '../actions/course/courseNameActions';

export default class CourseAdminPage extends React.Component {

  componentWillMount() {
    // trigger the first list of courseName.
    CourseNameActions.getCourseNames();
  }

  render(){
    return (
      <div className="container">
        <div className="row text-center">
          <h3>Administration des cours</h3>
        </div>
        <CourseAdmin />
      </div>
    );
  }
}
