import React                      from "react";
import PickerCommon               from "./PickerCommon";


export default class TimePicker extends React.Component {

  render() {
    return(
      <PickerCommon
        {...this.props}
        mode="time"
      />
    );
  }
}

