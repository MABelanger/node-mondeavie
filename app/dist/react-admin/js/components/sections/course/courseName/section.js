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
import sectionStyles              from "../styles.scss"



export default class CourseNameSection extends React.Component {

  constructor(props) {
    super(props);
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

  // Save button click
  onCtrlSave(e){

    // Get the new values fields
    let courseInput = this.refs.ctrlInput.getFields();
    let course = this.props.course;

    course = sectionHelper.overwriteAttrs(courseInput, course);
    // if course exist, save it, else create it
    if(course._id) {
      this.props.onSave(course);
    }
    else{
      this.props.onCreate(course);
    }
  }



  /**
   * Btn Control
   **/
  onCtrlDelete(course){
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
    this.setState({'course': {}});
    this.showSection();
    this.props.onNew();
  }

  // A course has been selected
  select(course){
    this.setState({course: course});
    // update the Admin state
    this.props.onSelect(course);
  }

  // Modify button click
  modify(){
    this.setState({'showSection': !this.state.showSection});
  }

  onDelete(){
    // call the admin delete
    this.props.onDelete();
  }

  getSectionInput(){

  }




  // render the component
  render() {

    let cx = classNames.bind(sectionStyles);
    this.sectionClasses = cx({
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
            + '( ' + this.props.course.name + ' ) ?'
            + " tout les professeurs relié à ce cour ainsi que leurs horaires seront aussi supprimé !"
          }
          onYes={::this.onDelete}
        />

        <CtrlSelect
          list={sectionHelper.getOrderedList(this.props.courses, 'name')}
          title="Noms de cours"
          onSelect={ this.select.bind(this) }
          onModify={this.modify.bind(this)}
          onNew={ this.new.bind(this) }
          value={ this.props.course.name }
          id={ this.props.course._id }
        />

        <div className="section-animation">
          <div className={this.sectionClasses}>
            <CtrlInput
              ref="ctrlInput"
              course={this.props.course}
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
