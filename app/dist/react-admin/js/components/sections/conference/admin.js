import React                          from "react";
import Conference                     from "./conference/admin";
import Schedule                       from "./schedule/admin";

import * as sectionHelper             from "../helper";

// Flux Conference
import ConferenceStore                from '../../../stores/conference/conferenceStore';
import * as ConferenceActions         from '../../../actions/conference/conferenceActions';

// Flux Schedule
import ScheduleStore                  from '../../../stores/conference/scheduleStore';
import * as ScheduleActions           from '../../../actions/conference/scheduleActions';

const CONFERENCE_LISTNER_FCT_NAMES = [
  { 
    storeFctAdd:'addListListener',
    storeFctRemove:'removeListListener',
    listenerFct: '_setConferences'
  },
  { 
    storeFctAdd:'addReadListener',
    storeFctRemove:'removeReadListener',
    listenerFct: '_getConference'
  },
  {
    storeFctAdd:'addDeletedListener',
    storeFctRemove:'removeDeletedListener',
    listenerFct: '_deletedConference'
  },
];

const SCHEDULE_LISTNER_FCT_NAMES = [
  { 
    storeFctAdd:'addListListener',
    storeFctRemove:'removeListListener',
    listenerFct: '_setSchedules'
  },
  { 
    storeFctAdd:'addReadListener',
    storeFctRemove:'removeReadListener',
    listenerFct: '_getSchedule'
  },
  {
    storeFctAdd:'addDeletedListener',
    storeFctRemove:'removeDeletedListener',
    listenerFct: '_deletedSchedule'
  },
];

export default class ConferenceAdmin extends React.Component {

  constructor(props) {
    super(props);
    // hack isMounted() : http://jaketrent.com/post/set-state-in-callbacks-in-react/
    this.mounted = false;
    this.conferenceListnerFctRemoveNames = null;
    this.scheduleListnerFctRemoveNames = null;
    this.state = {
      conferences : [],
      conference : {},

      schedules: [],
      schedule : {},
    };
  }

  componentDidMount() {
    this.mounted = true;

    // Conference
    this.conferenceListnerFctRemoveNames = 
      sectionHelper.addListeners(ConferenceStore, CONFERENCE_LISTNER_FCT_NAMES, this);

    // Schedule
    this.scheduleListnerFctRemoveNames = 
      sectionHelper.addListeners(ScheduleStore, SCHEDULE_LISTNER_FCT_NAMES, this);

  }

  componentWillUnmount() {
    this.mounted = false;

    // Conference
    sectionHelper.removeListeners(ConferenceStore, this.conferenceListnerFctRemoveNames);

    // Schedule
    sectionHelper.removeListeners(ScheduleStore, this.scheduleListnerFctRemoveNames);
  }

  /*
   * Conference
   */
  _deletedConference(){
      this._getConference();
  }

  _getConference(){
      this.setConference(ConferenceStore.getConference());
  }

  _setConferences(){
    this.setState({'conferences': ConferenceStore.getConferences()});
  }

  setConferences(conferences){
    this.setState({'conferences': conferences});
  }


  setConference(conference){
    this.setState({'conference': conference}, function(){
      this._resetSchedule();
    });
  }

  renderConference(){
    return(
      <div>
        <Conference
          ref="conferenceAdmin"
          conference={this.state.conference}
          conferences={this.state.conferences}
          setConferences={this.setConferences.bind(this)}
          setConference={this.setConference.bind(this)}
        />
        <hr/>
      </div>
    );
  }

  /*
   * Schedule
   */
  _resetSchedule(){
    this.setState({'schedule': {} }, function(){
      if (this.refs.scheduleAdmin) {
        ScheduleActions.getSchedules(this.state.conference._id);
        this.refs.scheduleAdmin.refs.scheduleSection.hideSection();
      }
    });
  }

  _deletedSchedule(){
    this._getSchedule();
  }

  _getSchedule(){
    this.setSchedule(ScheduleStore.getSchedule());
  }

  _setSchedules(){
    this.setState({'schedules': ScheduleStore.getSchedules()});
  }

  setSchedule(schedule){
    this.setState({'schedule': schedule}, function(){
      
    });
  }

  setSchedules(schedules){
    this.setState({'schedules': schedules});
  }

  renderSchedule(){
    return (
      <div>
        <Schedule
          ref="scheduleAdmin"
          setSchedule={this.setSchedule.bind(this)}
          setSchedules={this.setSchedules.bind(this)}
          schedule={ this.state.schedule }
          schedules={ this.state.schedules }
          conferenceId={this.state.conference._id}
          />
        <hr/>
      </div>
    );
  }

  /*
   * Render all sections
   */
  render() {
    return (
      <div>
        { this.renderConference() }
        { this.state.conference._id ? this.renderSchedule() : '' }
      </div>
    );
  }
}