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

export default class ConferenceNameSection extends React.Component {

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
    let conferenceInput = this.refs.ctrlInput.getFields();
    let conference = this.props.conference;

    conference = sectionHelper.overwriteAttrs(conferenceInput, conference);
    // if conference exist, save it, else create it
    if(conference._id) {
      this.props.onSave(conference);
    }
    else{
      this.props.onCreate(conference);
    }
  }



  /**
   * Btn Control
   **/
  onCtrlDelete(conference){
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
    this.setState({'conference': {}});
    this.showSection();
    this.props.onNew();
  }

  // A conference has been selected
  select(conference){
    this.setState({conference: conference});
    // update the Admin state
    this.props.onSelect(conference);
  }

  // Modify button click
  modify(){
    this.setState({'showSection': !this.state.showSection});
  }

  onDelete(){
    // call the admin delete
    this.props.onDelete();
  }

 /* 
  * custum cb for CtrlSelect
  */
  getName(item){
    let title = '';
    if(sectionHelper.isScheduleExpired(item.schedules)){
      title += "(terminé) ";
    }
    title += item.title;
    return title;
  }

  getValue(){
    if(this.props.conference.title){
      return this.getName(this.props.conference);
    } else {
      return "Conférences...";
    }
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
            + '( ' + this.getValue() + ' ) ?'
            + " tout les professeurs relié à ce cour ainsi que leurs horaires seront aussi supprimé !"
          }
          onYes={::this.onDelete}
        />

        <CtrlSelect
          list={sectionHelper.getOrderedList(this.props.conferences, 'title')}
          title="Titre des conférences"
          onSelect={ this.select.bind(this) }
          onModify={this.modify.bind(this)}
          onNew={ this.new.bind(this) }

          id={ this.props.conference._id }
          cbGetName={ this.getName.bind(this) }
          cbGetValue={ this.getValue.bind(this) }
        />

        <div className="section-animation">
          <div className={this.sectionClasses}>
            <CtrlInput
              ref="ctrlInput"
              conference={this.props.conference}
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