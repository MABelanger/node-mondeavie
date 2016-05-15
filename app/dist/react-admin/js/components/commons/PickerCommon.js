import React                      from "react";
import DateTimeField              from 'react-bootstrap-datetimepicker';
import moment                     from 'moment';
import                            "react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css";

const INPUT_FORMAT_DATE = "YYYY-MM-DD",
      INPUT_FORMAT_TIME = "HH:mm",
      FORMAT = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]",
      DEFAULT_TEXT_DATE = "Choisir une date",
      DEFAULT_TEXT_TIME = "Choisir une heure"


export default class PickerCommon extends React.Component {

  handleChange = (newDate) => {
    this.props.changeValue(this.props.name, newDate);
  }

  selectDateTime(mode) {
    let defaultText = null;
    let inputFormat = null;
    let myDate = this.props.date;

    // if no date, by default is the today at 00:00h
    // ex:. "2016-03-18T00:00:00.000Z"
    if(! myDate){
      myDate = String(moment().utcOffset("+00:00").startOf('day').toISOString());
    }

    if (mode == 'date') {
      defaultText = DEFAULT_TEXT_DATE;
      inputFormat = INPUT_FORMAT_DATE;

    } else if(mode == 'time') {
      defaultText = DEFAULT_TEXT_TIME;
      inputFormat = INPUT_FORMAT_TIME;
    }

    var wrapperClass = '';
    if (this.props.error && this.props.error.length > 0) {
      wrapperClass += " " + 'has-error';
    }
    return (
      <div className="form-horizontal">
        <div className={wrapperClass}>
          <div className="col-sm-3">
            <label htmlFor={this.props.name} className="control-label">
              <br />
              {this.props.label} :
            </label>
            <div className="input">{this.props.error}</div>
              <DateTimeField
                ref={mode + "Field"}
                mode={mode}
                defaultText={defaultText}
                dateTime={String(myDate)}
                format={FORMAT}
                inputFormat={inputFormat}
                onChange={this.handleChange}
              />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      this.selectDateTime(this.props.mode)
    );
  }
}

