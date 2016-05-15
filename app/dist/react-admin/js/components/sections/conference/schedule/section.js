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
    this.newKey = 0;

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
  create(schedule){
     // call admin to create the schedule
     this.props.onCreate(schedule);

  }

  /**
   * Update
   **/
  save(schedule){
    // call admin to save the schedule
    this.props.onSave(schedule);
  }


  _fixDayEnd(schedule){
    let dayStart = moment(schedule.dayStart).utcOffset("+00:00");
    let dayEnd = moment(schedule.dayEnd).utcOffset("+00:00");

    dayEnd =  dayStart.set({
               'hour' : dayEnd.get('hour'),
               'minute'  : dayEnd.get('minute')
              });

    schedule.dayEnd = dayEnd;
    return schedule;
  }


  // Save button click
  onCtrlSave(e){

    // Get the new values fields
    let scheduleInput = this.refs.ctrlInput.getFields();
    scheduleInput = this._fixDayEnd(scheduleInput);
    let schedule = this.props.schedule;

    schedule = sectionHelper.overwriteAttrs(scheduleInput, schedule);
    // if schedule exist, save it, else create it
    if(schedule._id) {
      this.props.onSave(schedule);
    }
    else{
      this.props.onCreate(schedule);
    }
  }
  /**
   * Delete
   **/
  delete(){
    this.props.onDelete(this.props.schedule);
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
    this.incrementNewKey();
  }

  // A schedule has been selected
  select(schedule){
    this.props.onSelect(schedule);
  }

  // Modify button click
  modify(){
    this.setState({'showSection': !this.state.showSection});
  }

  getCtrlSaveDel(){
    var errorBr = '';

    if (this.props.errors && (this.props.errors.dayStart || this.props.errors.dayEnd) ) {
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
  // TODO put it into the helper
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getName(item){
    moment.locale('fr');
    // remove the utcOffset added by .format()
    let dateStart = moment( item.dayStart ).utcOffset("+00:00");
    let dateEnd = moment( item.dayEnd ).utcOffset("+00:00");
    let weekDayName = moment.weekdays( moment(dateStart).day() );
    let name =  this.capitalizeFirstLetter( weekDayName ) 
                + ' ' + dateStart.format('LL')
                + ' ( ' + dateStart.format('HH:mm') + ' )'
                
    return name;
  }

  getValue(){
    if(this.props.schedule.dayStart){
      return this.getName(this.props.schedule);
    } else {
      return "Jours de cours...";
    }
  }

  incrementNewKey(){
    this.newKey ++;
    return this.newKey;
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
            "Voulez-vous vraiment supprimer la date de conference "
            + '( ' + this.getValue() + ' ) ?'
          }
          onYes={::this.delete}
        />

        <CtrlSelect
          list={this.props.schedules}
          title="Schedule"
          onSelect={ this.select.bind(this) }
          onModify={this.modify.bind(this)}
          onNew={ this.new.bind(this) }
          id={ this.props.schedule._id }

          cbGetName={ this.getName.bind(this) }
          cbGetValue={ this.getValue.bind(this) }
        />

        <div className="section-animation">
          <div className={sectionClasses}>
            <CtrlInput
              key={this.newKey}
              ref="ctrlInput"
              schedule={this.props.schedule}
              errors={this.props.errors}
              ctrlSaveDel={this.getCtrlSaveDel.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}
