import React                          from "react";
import toastr                         from 'toastr';

import CourseDescriptionSection              from "./section";

import * as sectionHelper             from "../../helper";

// Flux CourseDescription
import CourseDescriptionStore                from '../../../../stores/course/courseDescriptionStore';
import * as CourseDescriptionActions         from '../../../../actions/course/courseDescriptionActions';
import CourseDescriptionConstants            from '../../../../constants/course/courseDescriptionConstants';

// CSS
import 'toastr/build/toastr.css';

const COURSE_DESCRIPTION_LISTNER_FCT_NAMES = [
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

export default class CourseDescriptionAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.courseDescriptionListnerFctRemoveNames = null;
    this.state = {
      toastrMsg: {},
      errors: {},
    };
  }

  componentWillMount() {
    this.mounted = true;

    // CourseDescription
    this.courseDescriptionListnerFctRemoveNames = 
      sectionHelper.addListeners(CourseDescriptionStore, COURSE_DESCRIPTION_LISTNER_FCT_NAMES, this);
  }

  componentWillUnmount() {
    this.mounted = false;

    // CourseDescription
    sectionHelper.removeListeners(CourseDescriptionStore, this.courseDescriptionListnerFctRemoveNames);
  }
  _resetMsg(){
    this.setState({
      toastrMsg: {},
      errors: {}
    });
  }

  select(courseDescription){
    this.props.setCourseDescription(courseDescription);
    this._resetMsg();
  }

  new(){
    this.props.setCourseDescription({});
    this._resetMsg();
  }

  /*
   * listener called by the store
   */

  onSaved(){
    this._resetMsg();
    let toastrMsg = { success : 'La description de cours à été sauvegardé.'};
    this.setState({ toastrMsg: toastrMsg });
    this.refs.courseDescriptionSection.hideSection();
  }

  onDeleted(){
    this._resetMsg();
    let toastrMsg = { success : 'La description de cours à été supprimé.'};
    this.setState({ toastrMsg: toastrMsg });
    this.refs.courseDescriptionSection.hideSection();
  }

  onError(){
    this._resetMsg();
    let errors = CourseDescriptionStore.getErrors();
    let toastrMsg = { error : "Erreur.<br/>"};
    this.setState({ errors: errors, toastrMsg: toastrMsg });
  }

  /**
   * CRUD Operations
   **/
  // Create
  create(courseDescription){
    CourseDescriptionActions.createCourseDescription(courseDescription, this.props.courseId, this.props.teacherId);
  }

  // Read is admin by the parent component.

  // Update
  save(courseDescription){
    CourseDescriptionActions.saveCourseDescription(courseDescription, this.props.courseId, this.props.teacherId);
  }

  // Delete
  delete(){
    CourseDescriptionActions.deleteCourseDescription(this.props.courseDescription, this.props.courseId, this.props.teacherId);  
  }

  // toastrMsg={this.state.toastrMsg}
  render() {
    return (
        <CourseDescriptionSection
          ref="courseDescriptionSection"
          courseDescription={ this.props.courseDescription }
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

