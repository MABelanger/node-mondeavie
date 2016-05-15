import React                      from "react";
import classNames                 from "classnames/bind";

export default class BtnDanger extends React.Component {

  click(e){
    // disable click if button is disabled
    if(this.props.disabled != true){
      this.props.onClick(e);
    }
  }

  getClassNames(btnType){
    let className =  {
      'btn' : true,
      'disabled': ( this.props.disabled == true )
    };
    className[btnType] = true;
    return className;
  }

  render() {

    let classes = classNames(
      this.getClassNames(this.props.btnType)
    );

    return (
      <button
        className={classes}
        onClick={ (e)=>{ this.click(e); } }>
          {this.props.label}
        </button>
    );
  }
}