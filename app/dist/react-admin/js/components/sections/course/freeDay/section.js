// vendors
import React                      from "react";
import classNames                 from "classnames/bind";
import ModalBootstrap             from "../../../ModalBootstrap";
import toastr                     from 'toastr';
import moment                     from "moment";


// modules
import CtrlSelect                 from "../../../commons/ctrl/CtrlSelect";
import CtrlSaveDel                from "../../../commons/ctrl/CtrlSaveDel";
import CtrlInput                  from "./CtrlInput";
import * as sectionHelper           from "../../helper";



// Styles
import 'toastr/build/toastr.css';
import sectionStyles              from "../styles.scss"



export default class ScheduleSection extends React.Component {

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
  create(freeDay){
     // call admin to create the freeDay
     this.props.onCreate(freeDay);

  }

  /**
   * Update
   **/
  save(freeDay){
    // call admin to save the freeDay
    this.props.onSave(freeDay);
  }

  // Save button click
  onCtrlSave(e){

    // Get the new values fields
    let freeDayInput = this.refs.ctrlInput.getFields();
    let freeDay = this.props.freeDay;

    freeDay = sectionHelper.overwriteAttrs(freeDayInput, freeDay);
    // if freeDay exist, save it, else create it
    if(freeDay._id) {
      this.props.onSave(freeDay);
    }
    else{
      this.props.onCreate(freeDay);
    }
  }
  /**
   * Delete
   **/
  delete(){
    this.props.onDelete(this.props.freeDay);
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

  // A freeDay has been selected
  select(freeDay){
    this.props.onSelect(freeDay);
  }

  // Modify button click
  modify(){
    this.setState({'showSection': !this.state.showSection});
  }


  getCtrlSaveDel(){
    var errorBr = '';

    if (this.props.errors && this.props.errors.day ) {
      errorBr = <br/>;
    }

    return(
      <div className="form-horizontal">
        <div className="col-sm-3">
          <label className="control-label">
            &nbsp;
            { errorBr }
            { errorBr }
          </label>
          <div className="input">&nbsp;</div>
            
            <CtrlSaveDel
              noRow={true}
              onSave={ (e)=>{ this.onCtrlSave(e); } }
              onDelete={ (e)=>{ this.onCtrlDelete(e); } }
            />
        </div>
      </div>
    );
  }

 /* 
  * custum cb for CtrlSelect
  */
  getName(item){
    moment.locale('fr');
    // remove the utcOffset added by .format()
    let date = moment( item.day ).utcOffset("+00:00");
    let name = moment(date).format('LL');
    return name;
  }

  getValue(){
    if(this.props.freeDay.day){
      return this.getName(this.props.freeDay);
    } else {
      return "Jours Gratuit...";
    }
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
            + '( ' + this.getValue() + ' ) ?'
            + " tout les professeurs relié à ce cour ainsi que leurs horaires seront aussi supprimé !"
          }
          onYes={::this.delete}
        />

        <CtrlSelect
          list={this.props.freeDays}
          title="Jours Gratuit"
          onSelect={ this.select.bind(this) }
          onModify={ this.modify.bind(this) }
          onNew={ this.new.bind(this) }

          id={ this.props.freeDay._id }
          cbGetName={ this.getName.bind(this) }
          cbGetValue={ this.getValue.bind(this) }
        />

        <div className="section-animation">
          <div className={sectionClasses}>
            <CtrlInput
              ref="ctrlInput"
              freeDay={this.props.freeDay}
              errors={this.props.errors}
              ctrlSaveDel={this.getCtrlSaveDel.bind(this)}
            />
          </div>
        </div>

      </div>
    );
  }
}
