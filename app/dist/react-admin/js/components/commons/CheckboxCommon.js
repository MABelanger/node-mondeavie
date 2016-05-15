import React                      from "react";


export default class Checkbox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked || false
    };
  }

  handleChange(e) {
    const value = e.target.checked;
    this.props.changeValue(this.props.name, value);
  }


  render() {
    return (
      <input type="checkbox"
        name={this.props.name}
        className="form-control"
        checked={this.props.checked}
        ref={this.props.name}
        value={this.props.value} 
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}