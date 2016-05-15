"use strict";
import React                          from "react";

//import Admin from "./components/sections/course/admin";
import ConferenceAdmin                from "../components/sections/conference/admin";
import * as ConferenceActions         from '../actions/conference/conferenceActions';

export default class ConferenceAdminPage extends React.Component {

  componentDidMount() {
    ConferenceActions.getConferences();
  }

  render(){
    return (
      <div className="container">
        <div className="row text-center">
          <h3>Administration des conferences et atteliers</h3>
        </div>
        <ConferenceAdmin />
      </div>
    );
  }
}