import React                      from "react";
import BtnCommon                  from "./BtnCommon";

export default class BtnSuccess extends React.Component {

  render() {
    return (
      <BtnCommon
        {...this.props}
        btnType="btn-success"
      />
    );
  }
}