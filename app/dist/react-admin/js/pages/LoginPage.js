"use strict";
import React                          from "react";

import LoginForm                      from "../components/sections/user/loginForm";

export default class ConferenceAdminPage extends React.Component {

  render(){
    return (
      <div className="container">
        <LoginForm/>
      </div>
    );
  }
}