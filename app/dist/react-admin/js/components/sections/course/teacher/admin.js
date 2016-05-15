import React                          from "react";
import toastr                         from 'toastr';

import TeacherSection              from "./section";

import * as sectionHelper             from "../../helper";

// Flux Teacher
import TeacherStore                from '../../../../stores/course/teacherStore';
import * as TeacherActions         from '../../../../actions/course/teacherActions';
import TeacherConstants            from '../../../../constants/course/teacherConstants';

// CSS
import 'toastr/build/toastr.css';

const TEACHER_LISTNER_FCT_NAMES = [
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

export default class TeacherAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.teacherListnerFctRemoveNames = null;
    this.state = {
      toastrMsg: {},
      errors: {},
    };
  }

  componentWillMount() {
    this.mounted = true;

    // Teacher
    this.teacherListnerFctRemoveNames = 
      sectionHelper.addListeners(TeacherStore, TEACHER_LISTNER_FCT_NAMES, this);
  }

  componentWillUnmount() {
    this.mounted = false;

    // Teacher
    sectionHelper.removeListeners(TeacherStore, this.teacherListnerFctRemoveNames);
  }

  _resetMsg(){
    this.setState({
      toastrMsg: {},
      errors: {}
    });
  }

  select(teacher){
    this.props.setTeacher(teacher);
    this._resetMsg();
  }

  new(){
    this.props.setTeacher({});
    this._resetMsg();
  }

  /*
   * listener called by the store
   */

  onSaved(){
    this._resetMsg();
    let toastrMsg = { success : 'Le professeur à été sauvegardé.'};
    this.setState({ toastrMsg: toastrMsg });
    this.refs.teacherSection.hideSection();
  }

  onDeleted(){
    this._resetMsg();
    let toastrMsg = { success : 'Le professeur à été supprimé.'};
    this.setState({ toastrMsg: toastrMsg });
    this.refs.teacherSection.hideSection();
  }

  onError(){
    this._resetMsg();
    let errors = TeacherStore.getErrors();
    let toastrMsg = { error : "Erreur.<br/>"};
    this.setState({ errors: errors, toastrMsg: toastrMsg });
  }

  /**
   * CRUD Operations
   **/
  // Create
  create(teacher){
    TeacherActions.createTeacher(teacher, this.props.courseId);
  }

  // Read is admin by the parent component.

  // Update
  save(teacher){
    TeacherActions.saveTeacher(teacher, this.props.courseId);
  }

  // Delete
  delete(){
    TeacherActions.deleteTeacher(this.props.teacher, this.props.courseId);  
  }

  render() {
    return (
      <div>
        <TeacherSection
          ref="teacherSection"
          teachers={this.props.teachers}
          teacher={this.props.teacher}
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

