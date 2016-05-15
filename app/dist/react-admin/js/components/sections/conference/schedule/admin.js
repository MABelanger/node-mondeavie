import React                          from "react";
import toastr                         from 'toastr';

import ScheduleSection                from "./section";

import * as sectionHelper             from "../../helper";

// Flux Schedule
import ScheduleStore                  from '../../../../stores/conference/scheduleStore';
import * as ScheduleActions           from '../../../../actions/conference/scheduleActions';
import ScheduleConstants              from '../../../../constants/conference/scheduleConstants';

// CSS
import 'toastr/build/toastr.css';

const SCHEDULE_LISTNER_FCT_NAMES = [
  { 
    storeFctAdd:'addSavedListener',
    storeFctRemove:'removeSavedListener',
    listenerFct: 'onSaved'
  },
  {
    storeFctAdd:'addDeletedListener',
    storeFctRemove:'removeDeletedListener',
    listenerFct: 'onDeleted'
  },
  { 
    storeFctAdd:'addErrorListener',
    storeFctRemove:'removeErrorListener',
    listenerFct: 'onError'
  }
];

export default class ScheduleAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.scheduleListnerFctRemoveNames = null;
    this.state = {
      toastrMsg: {},
      errors: {},
    };
  }

  componentWillMount() {
    this.mounted = true;

    // Schedule
    this.scheduleListnerFctRemoveNames = 
      sectionHelper.addListeners(ScheduleStore, SCHEDULE_LISTNER_FCT_NAMES, this);
  }

  componentWillUnmount() {
    this.mounted = false;

    // Schedule
    sectionHelper.removeListeners(ScheduleStore, this.scheduleListnerFctRemoveNames);
  }
  _resetMsg(){
    this.setState({
      toastrMsg: {},
      errors: {}
    });
  }

  select(schedule){
    this.props.setSchedule(schedule);
    this._resetMsg();
  }

  new(){
    this.props.setSchedule({});
    this._resetMsg();
  }

  /*
   * listener called by the store
   */

  onSaved(){
    this._resetMsg();
    let toastrMsg = { success : 'La conférence à été sauvegardé.'};

    this.setState({ toastrMsg: toastrMsg });
    this.refs.scheduleSection.hideSection();
  }

  onDeleted(){
    this._resetMsg();
    let toastrMsg = { success : 'La conférence à été supprimé.'};

    this.setState({ toastrMsg: toastrMsg });
    this.refs.scheduleSection.hideSection();
  }

  onError(){
    this._resetMsg();
    let errors = ScheduleStore.getErrors();
    let toastrMsg = { error : "Erreur.<br/>"};

    this.setState({ errors: errors, toastrMsg: toastrMsg });
  }

  /**
   * CRUD Operations
   **/
  // Create
  create(schedule){
    ScheduleActions.createSchedule(schedule, this.props.conferenceId);
  }

  // Read is admin by the parent component.

  // Update
  save(schedule){
    ScheduleActions.saveSchedule(schedule, this.props.conferenceId);
  }

  // Delete
  delete(){
    ScheduleActions.deleteSchedule(this.props.schedule, this.props.conferenceId);  
  }

  render() {
    return (
      <div>
        <ScheduleSection
          ref="scheduleSection"
          schedules={this.props.schedules}
          schedule={this.props.schedule}
          onSelect={this.select.bind(this)}
          onNew={this.new.bind(this)}
          errors={this.state.errors}
          toastrMsg={this.state.toastrMsg}

          onCreate={this.create.bind(this)}
          onSave={this.save.bind(this)}
          onDelete={this.delete.bind(this)}
        />  
      </div>
    );
  }
}

