import React                          from "react";
import toastr                         from 'toastr';

import FreeDaySection              from "./section";

import * as sectionHelper             from "../../helper";

// Flux FreeDay
import FreeDayStore                from '../../../../stores/course/freeDayStore';
import * as FreeDayActions         from '../../../../actions/course/freeDayActions';
import FreeDayConstants            from '../../../../constants/course/freeDayConstants';

// CSS
import 'toastr/build/toastr.css';

const FREE_DAY_LISTNER_FCT_NAMES = [
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

export default class FreeDayAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.freeDayListnerFctRemoveNames = null;
    this.state = {
      toastrMsg: {},
      errors: {},
    };
  }

  componentWillMount() {
    this.mounted = true;

    // FreeDay
    this.freeDayListnerFctRemoveNames = 
      sectionHelper.addListeners(FreeDayStore, FREE_DAY_LISTNER_FCT_NAMES, this);
  }

  componentWillUnmount() {
    this.mounted = false;

    // FreeDay
    sectionHelper.removeListeners(FreeDayStore, this.freeDayListnerFctRemoveNames);
  }

  _resetMsg(){
    this.setState({
      toastrMsg: {},
      errors: {}
    });
  }

  select(freeDay){
    this.props.setFreeDay(freeDay);
    this._resetMsg();
  }

  new(){
    this.props.setFreeDay({});
    this._resetMsg();
  }

  /*
   * listener called by the store
   */

  onSaved(){
    this._resetMsg();
    let toastrMsg = { success : 'La freeDay à été sauvegardé.'};
    this.setState({ toastrMsg: toastrMsg });
    this.refs.freeDaySection.hideSection();
  }

  onDeleted(){
    this._resetMsg();
    let toastrMsg = { success : 'La freeDay à été supprimé.'};
    this.setState({ toastrMsg: toastrMsg });
    this.refs.freeDaySection.hideSection();
  }

  onError(){
    this._resetMsg();
    let errors = FreeDayStore.getErrors();
    let toastrMsg = { error : "Erreur.<br/>"};
    this.setState({ errors: errors, toastrMsg: toastrMsg });
  }

  /**
   * CRUD Operations
   **/
  // Create
  create(freeDay){
    let courseId = this.props.courseId;
    let teacherId = this.props.teacherId;
    let courseTypeId = this.props.courseTypeId;
    let scheduleId = this.props.scheduleId;
    FreeDayActions.createFreeDay(freeDay, courseId, teacherId, courseTypeId, scheduleId);
  }

  // Read is admin by the parent component.

  // Update
  save(freeDay){
    let courseId = this.props.courseId;
    let teacherId = this.props.teacherId;
    let courseTypeId = this.props.courseTypeId;
    let scheduleId = this.props.scheduleId;
    FreeDayActions.saveFreeDay(freeDay, courseId, teacherId, courseTypeId, scheduleId);
  }

  // Delete
  delete(){
    let courseId = this.props.courseId;
    let teacherId = this.props.teacherId;
    let courseTypeId = this.props.courseTypeId;
    let scheduleId = this.props.scheduleId;
    FreeDayActions.deleteFreeDay(this.props.freeDay, courseId, teacherId, courseTypeId, scheduleId);  
  }

  render() {
    return (
      <div>
        <FreeDaySection
          ref="freeDaySection"
          freeDays={this.props.freeDays}
          freeDay={this.props.freeDay}
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

