import React                          from "react";
import toastr                         from 'toastr';

import CourseTypeSection              from "./section";

import * as sectionHelper             from "../../helper";

// Flux CourseType
import CourseTypeStore                from '../../../../stores/course/courseTypeStore';
import * as CourseTypeActions         from '../../../../actions/course/courseTypeActions';
import CourseTypeConstants            from '../../../../constants/course/courseTypeConstants';

// CSS
import 'toastr/build/toastr.css';

const COURSE_TYPE_LISTNER_FCT_NAMES = [
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

export default class CourseTypeAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.courseTypeListnerFctRemoveNames = null;
    this.state = {
      toastrMsg: {},
      errors: {},
    };
  }

  componentWillMount() {
    this.mounted = true;

    // CourseType
    this.courseTypeListnerFctRemoveNames = 
      sectionHelper.addListeners(CourseTypeStore, COURSE_TYPE_LISTNER_FCT_NAMES, this);
  }

  componentWillUnmount() {
    this.mounted = false;

    // CourseType
    sectionHelper.removeListeners(CourseTypeStore, this.courseTypeListnerFctRemoveNames);
  }

  _resetMsg(){
    this.setState({
      toastrMsg: {},
      errors: {}
    });
  }

  select(courseType){
    this.props.setCourseType(courseType);
    this._resetMsg();
  }

  new(){
    this.props.setCourseType({});
    this._resetMsg();
  }

  /*
   * listener called by the store
   */

  onSaved(){
    this._resetMsg();
    let toastrMsg = { success : 'Le type de cours à été sauvegardé.'};
    this.setState({ toastrMsg: toastrMsg });
    this.refs.courseTypeSection.hideSection();
  }

  onDeleted(){
    this._resetMsg();
    let toastrMsg = { success : 'Le type de cours à été supprimé.'};
    this.setState({ toastrMsg: toastrMsg });
    this.refs.courseTypeSection.hideSection();
  }

  onError(){
    this._resetMsg();
    let errors = CourseTypeStore.getErrors();
    let toastrMsg = { error : "Erreur.<br/>"};
    this.setState({ errors: errors, toastrMsg: toastrMsg });
  }

  /**
   * CRUD Operations
   **/
  // Create
  create(courseType){
    CourseTypeActions.createCourseType(courseType, this.props.courseId, this.props.teacherId);
  }

  // Read is admin by the parent component.

  // Update
  save(courseType){
    CourseTypeActions.saveCourseType(courseType, this.props.courseId, this.props.teacherId);
  }

  // Delete
  delete(){
    CourseTypeActions.deleteCourseType(this.props.courseType, this.props.courseId, this.props.teacherId);  
  }

  render() {
    return (
      <div>
        <CourseTypeSection
          ref="courseTypeSection"
          courseTypes={this.props.courseTypes}
          courseType={this.props.courseType}
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

