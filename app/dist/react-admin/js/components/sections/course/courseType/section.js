// vendors
import React                      from "react";
import classNames                 from "classnames/bind";
import ModalBootstrap             from "../../../ModalBootstrap";
import toastr                     from 'toastr';


// modules
import CtrlSelect                 from "../../../commons/ctrl/CtrlSelect";
import CtrlSaveDel                from "../../../commons/ctrl/CtrlSaveDel";
import CtrlInput                  from "./CtrlInput";
import * as sectionHelper           from "../../helper";



// Styles
import 'toastr/build/toastr.css';
import sectionStyles              from "../styles.scss"



export default class CourseTypeSection extends React.Component {

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
  create(courseType){
     // call admin to create the courseType
     this.props.onCreate(courseType);

  }

  /**
   * Update
   **/
  save(courseType){
    // call admin to save the courseType
    this.props.onSave(courseType);
  }

  // Save button click
  onCtrlSave(e){

    // Get the new values fields
    let courseTypeInput = this.refs.ctrlInput.getFields();
    let courseType = this.props.courseType;

    courseType = sectionHelper.overwriteAttrs(courseTypeInput, courseType);
    // if courseType exist, save it, else create it
    if(courseType._id) {
      this.props.onSave(courseType);
    }
    else{
      this.props.onCreate(courseType);
    }
  }
  /**
   * Delete
   **/
  delete(){
    this.props.onDelete(this.props.courseType);
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

  // A courseType has been selected
  select(courseType){
    this.props.onSelect(courseType);
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
            + '( ' + this.props.courseType.name + ' ) ?'
            + " tout les professeurs relié à ce cour ainsi que leurs horaires seront aussi supprimé !"
          }
          onYes={::this.delete}
        />

        <CtrlSelect
          list={this.props.courseTypes}
          title="Type de Cours"
          onSelect={ this.select.bind(this) }
          onModify={this.modify.bind(this)}
          onNew={ this.new.bind(this) }
          value={ this.props.courseType.name}
          id={ this.props.courseType._id }
        />

        <div className="section-animation">
          <div className={sectionClasses}>
            <CtrlInput
              ref="ctrlInput"
              courseType={this.props.courseType}
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
