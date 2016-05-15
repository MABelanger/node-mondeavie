import React                      from "react";
import CheckboxCommon             from "../../../commons/CheckboxCommon";
import DatePicker                 from "../../../commons/DatePicker";
import TimePicker                 from "../../../commons/TimePicker";
import * as sectionHelper         from "../../helper";

import 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import 'font-awesome/css/font-awesome.css'; 

export default class ScheduleCtrlInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFull: false,
      dayStart: null,
      dayEnd: null
    };
  }

  changeValue(name, value) {
    let newState = {};
    newState[name] = value;
    this.setState(newState);
  }

  getFields(){
    return {
      isFull: this.state.isFull,
      dayStart: this.state.dayStart,
      dayEnd: this.state.dayEnd
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.schedule) {
      this.setState({
        isFull: nextProps.schedule.isFull,
        dayStart: nextProps.schedule.dayStart,
        dayEnd: nextProps.schedule.dayEnd
      });
    }
  }
 

  renderCheckBox(){
    return(
      <form role="form">
        &nbsp;<br/>
        <div class="checkbox abc-checkbox">
          <CheckboxCommon
            id="checkbox1"
            className="pull-left"
            name="isFull"
            label="Complet"
            ref="isFull"
            error={sectionHelper.getError("isFull", this.props.errors)}
            checked={this.state.isFull}
            changeValue={ (name, value) => { this.changeValue(name, value); } }
          />
          <label for="checkbox1">
              <b>Complet</b>
          </label>
        </div>
      </form>
    );
  }

  renderDates(){
    return(
        <div className="clearfix">
          <div className="col-sm-offset-1 col-sm-1">
            &nbsp;
          </div>
          <DatePicker
            name="dayStart"
            label="Date"
            ref="dayStart"
            error={sectionHelper.getError("dayStart", this.props.errors)}
            date={this.state.dayStart}
            changeValue={ (name, value) => { this.changeValue(name, value); } }
          />
          <div className="col-sm-4">&nbsp;</div>
        </div>
    );
  }

  renderHours(){
    return(
        <div className="clearfix">
          <div className="col-sm-offset-1 col-sm-1">
            {this.renderCheckBox()}
          </div>
          
            <TimePicker
              name="dayStart"
              label="Début"
              ref="dayStart"
              error={sectionHelper.getError("dayStart", this.props.errors)}
              date={this.state.dayStart}
              changeValue={ (name, value) => { this.changeValue(name, value); } }
            />
          
            <TimePicker
              name="dayEnd"
              label="Fin"
              ref="dayEnd"
              error={sectionHelper.getError("dayEnd", this.props.errors)}
              date={this.state.dayEnd}
              changeValue={ (name, value) => { this.changeValue(name, value); } }
            />

          {this.props.ctrlSaveDel()}
        </div>
    );
  }


  render() {
    return (
      <div>
        {this.renderDates()}
        {this.renderHours()}
      </div>
    );
  }
}