import React                      from "react";

export default class Checkbox extends React.Component {

  handleChange = (day) => {
    this.props.changeValue(this.props.name, day.name);
  }

  render() {
    var wrapperClass = 'form-group';
    if (this.props.error && this.props.error.length > 0) {
      wrapperClass += " " + 'has-error';
    }
    return (
      <div className="form-horizontal">
        <div className={wrapperClass}>
          <label htmlFor={this.props.name} className="control-label col-xs-2">
            {this.props.title} :
          </label>
          <div className="col-sm-3">
            <div className="input">{this.props.error}</div>
              <Dropdown
                list={days}
                label={this.props.title}
                onSelect={ this.handleChange }
                value={this.props.value}/>
        </div>
      </div>
    );
  }
}