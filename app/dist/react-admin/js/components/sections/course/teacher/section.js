// vendors
import React                      from "react";
import classNames                 from "classnames/bind";
import ModalBootstrap             from "../../../ModalBootstrap";
import toastr                     from 'toastr';

// modules
import CtrlSelect                 from "../../../commons/ctrl/CtrlSelect";
import CtrlSaveDel                from "../../../commons/ctrl/CtrlSaveDel";
import CtrlInput                  from "./CtrlInput";
import * as sectionHelper         from "../../helper";

// Styles
import 'toastr/build/toastr.css';
import sectionStyles              from "../styles.scss"



export default class TeacherSection extends React.Component {

  constructor(props) {
    super(props);
    // expose the method to the parent via props
    this.showSection = this.showSection.bind(this);
    this.hideSection = this.hideSection.bind(this);

    this.state = {
      showSection: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    let toastrMsg = nextProps.toastrMsg;
    let errorsStr = sectionHelper.getErrorsStr(nextProps.errors);

    if( nextProps.errors != this.props.errors ){ 
      if ( toastrMsg.error &&  errorsStr ){
        // if error msg toaster, put it at the top
        toastrMsg.error = toastrMsg.error + errorsStr;
      }

      // display the msg err
      if( toastrMsg.error ||  errorsStr ){
        toastr.error(toastrMsg.error);
      }
    }

    if (toastrMsg != this.props.toastrMsg) {
      // display the msg success
      if( toastrMsg.success ){
        toastr.success(toastrMsg.success);
      }
    }

  }

  /**
   * Create
   **/
  create(teacher){
     // call admin to create the teacher
     this.props.onCreate(teacher);

  }

  /**
   * Update
   **/
  save(teacher){
    // call admin to save the teacher
    this.props.onSave(teacher);
  }

  // Save button click
  onCtrlSave(e){

    // Get the new values fields
    let teacherInput = this.refs.ctrlInput.getFields();
    let teacher = this.props.teacher;

    teacher = sectionHelper.overwriteAttrs(teacherInput, teacher);
    // if teacher exist, save it, else create it
    if(teacher._id) {
      this.props.onSave(teacher);
    }
    else{
      this.props.onCreate(teacher);
    }
  }
  /**
   * Delete
   **/
  delete(){
    this.props.onDelete(this.props.teacher);
    this.hideSection()
  }

  /**
   * Btn Control
   **/
  onCtrlDelete(e){
    this.refs.modalBootstrap.open();
  } 


  // Show all property section fields
  showSection(){
    this.setState({'showSection': true});
  }

   // Hide all property section fields
  hideSection(){
    this.setState({'showSection': false});
  }

  // New button click
  new(){
    this.props.onNew();
    this.showSection();
  }

  // A teacher has been selected
  select(teacher){
    this.props.onSelect(teacher);
  }

  // Modify button click
  modify(){
    this.setState({'showSection': !this.state.showSection});
  }

  // render the component
  render() {
    let cx = classNames.bind(sectionStyles);
    let sectionClasses = cx({
      'section-transition' : true,
        'section-show': ( this.state.showSection == true ),
        'section-hide': ( this.state.showSection == false )
    });

    return (
      <div className="row">

        <ModalBootstrap
          ref="modalBootstrap"
          msg={
            "Voulez-vous vraiment supprimer ce cour "
            + '( ' + this.props.teacher.firstName + ' ) ?'
            + " tout les professeurs relié à ce cour ainsi que leurs horaires seront aussi supprimé !"
          }
          onYes={::this.delete}
        />

        <CtrlSelect
          list={sectionHelper.getOrderedList(this.props.teachers, 'firstName')}
          title="Professeurs"
          onSelect={ this.select.bind(this) }
          onModify={this.modify.bind(this)}
          onNew={ this.new.bind(this) }
          value={ this.props.teacher.firstName}
          id={ this.props.teacher._id }
        />

        <div className="section-animation">
          <div className={sectionClasses}>
            <CtrlInput
              ref="ctrlInput"
              teacher={this.props.teacher}
              errors={this.props.errors}
            />
            <CtrlSaveDel
              onSave={ (e)=>{ this.onCtrlSave(e); } }
              onDelete={ (e)=>{ this.onCtrlDelete(e); } }
            />
          </div>
        </div>
      </div>
    );
  }
}
