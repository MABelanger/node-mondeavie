import React                          from "react";
import toastr                         from 'toastr';

import CourseNameSection              from "./section";

import * as sectionHelper             from "../../helper";

// Flux CourseName
import CourseNameStore                from '../../../../stores/course/courseNameStore';
import * as CourseNameActions         from '../../../../actions/course/courseNameActions';
import CourseNameConstants            from '../../../../constants/course/courseNameConstants';

// CSS
import 'toastr/build/toastr.css';

const COURSE_NAME_LISTNER_FCT_NAMES = [
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

export default class CourseNameAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.courseNameListnerFctRemoveNames = null;
    this.state = {
      toastrMsg: {},
      errors: {},
    };
  }

  componentWillMount() {
    this.mounted = true;

    // CourseName
    this.courseNameListnerFctRemoveNames = 
      sectionHelper.addListeners(CourseNameStore, COURSE_NAME_LISTNER_FCT_NAMES, this);
  }

  componentWillUnmount() {
    this.mounted = false;

    // CourseName
    sectionHelper.removeListeners(CourseNameStore, this.courseNameListnerFctRemoveNames);
  }

  _resetMsg(){
    this.setState({
      toastrMsg: {},
      errors: {}
    });
  }

  select(course){
    this.props.setCourse(course);
    this._resetMsg();
  }

  new(){
    this.props.setCourse({});
    this._resetMsg();
  }

  /*
   * listener called by the store
   */

  onSaved(){
    this._resetMsg();
    let toastrMsg = { success : 'Le cours à été sauvegardé.'};
    this.setState({ toastrMsg: toastrMsg });
    this.refs.courseNameSection.hideSection();
  }

  onDeleted(){
    this._resetMsg();
    let toastrMsg = { success : 'Le cours à été supprimé.'};
    this.setState({ toastrMsg: toastrMsg });
    this.refs.courseNameSection.hideSection();
  }

  onError(){
    this._resetMsg();
    let errors = CourseNameStore.getErrors();
    let toastrMsg = { error : "Erreur.<br/>"};
    this.setState({ errors: errors, toastrMsg: toastrMsg });
  }

  /**
   * CRUD Operations
   **/
  // Create
  create(course){
    CourseNameActions.createCourseName(course);
  }

  // Read is admin by the parent component.

  // Update
  save(course){
    CourseNameActions.saveCourseName(course);
  }

  // Delete
  delete(){
    CourseNameActions.deleteCourseName(this.props.course);  
  }

  render() {
    return (
      <CourseNameSection
        ref="courseNameSection"
        courses={this.props.courses}
        course={this.props.course}
        onSelect={this.select.bind(this)}
        onNew={this.new.bind(this)}
        errors={this.state.errors}
        toastrMsg={this.state.toastrMsg}

        onCreate={this.create.bind(this)}
        onSave={this.save.bind(this)}
        onDelete={this.delete.bind(this)}
      />
    );
  }
}

