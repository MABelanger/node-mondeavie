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
      day: this.props.freeDay.day,
      isFull: this.props.freeDay.isFull,
    };
  }

  changeValue(name, value) {
    let newState = {};
    newState[name] = value;
    this.setState(newState);
  }

  getFields(){
    return {
      day: this.state.day,
      isFull: this.state.isFull
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.freeDay) {
      this.setState({
        day: nextProps.freeDay.day,
        isFull: nextProps.freeDay.isFull
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

  renderDate(){
    return(
        <div className="clearfix">
          <div className="col-sm-offset-1 col-sm-1">
            {this.renderCheckBox()}
          </div>
            <DatePicker
              name="day"
              label="Jour"
              ref="day"
              error={sectionHelper.getError("day", this.props.errors)}
              date={this.state.day}
              changeValue={ (name, value) => { this.changeValue(name, value); } }
            />

          {this.props.ctrlSaveDel()}

          <div className="col-sm-3">
            &nbsp;
          </div>
        </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderDate()}
      </div>
    );
  }
}