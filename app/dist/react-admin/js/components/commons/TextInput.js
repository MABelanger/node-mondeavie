"use strict";

import React from "react";

export default class TextInput extends React.Component {

  handleChange(e) {
    const value = e.target.value;
    this.props.changeValue(this.props.name, value);
  }

  render() {
    var wrapperClass = 'form-group no-margin';
    if (this.props.error && this.props.error.length > 0) {
      wrapperClass += " " + 'has-error';
    }
    return (
      <div className="form-horizontal">
        <div className={wrapperClass}>
          <label htmlFor={this.props.name} className="control-label col-xs-2">
            {this.props.label} :
          </label>
          <div className="col-sm-3">
            <div className="input">{this.props.error}</div>
            <input type="text"
              name={this.props.name}
              className="form-control"
              placeholder={this.props.placeholder}
              ref={this.props.name}
              value={this.props.value}
              onChange={this.handleChange.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}

TextInput.propTypes = {
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  changeValue: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.string,
  error: React.PropTypes.string
};