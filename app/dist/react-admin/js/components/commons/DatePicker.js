import React                      from "react";
import PickerCommon               from "./PickerCommon";


export default class DatePicker extends React.Component {

  render() {
    return(
      <PickerCommon
        {...this.props}
        mode="date"
      />
    );
  }
}

