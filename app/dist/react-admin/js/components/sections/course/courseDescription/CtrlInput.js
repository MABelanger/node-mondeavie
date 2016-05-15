import React                      from "react";
import TextInput                  from "../../../commons/TextInput";
import ReactQuill                 from "../../../commons/reactQuill";
import Checkbox                   from "../../../commons/Checkbox";
import Image                      from "../../../Image";
import * as sectionHelper         from "../../helper";

export default class CourseDescriptionCtrlInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      "courseType": "",
      "note": "",
      "image": "",
      "description": "",
      "price": "",
      "isVisible": true
    };
  }


  changeValue(name, value) {
    let newState = {};
    newState[name] = value;
    this.setState(newState);
  }

  getFields(){
    return {
      courseType: this.state.courseType,
      note: this.state.note,
      image: this.state.image,
      description: this.state.description,
      price: this.state.price,
      isVisible: this.state.isVisible
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.courseDescription) {
      this.setState({
        courseType: nextProps.courseDescription.courseType,
        note: nextProps.courseDescription.note,
        image: nextProps.courseDescription.image,
        description: nextProps.courseDescription.description,
        price: nextProps.courseDescription.price,
        isVisible: nextProps.courseDescription.isVisible
      });
    }
  }

  render() {
    return (
      <div>
        <Checkbox
          name="isVisible"
          label="Visible"
          ref="isVisible"
          error={sectionHelper.getError("isVisible", this.props.errors)}
          checked={this.state.isVisible}
          changeValue={ (name, value) => { this.changeValue(name, value); } }
          
        />
        <TextInput
          name="courseType"
          label="Type"
          ref="courseType"
          error={sectionHelper.getError("courseType", this.props.errors)}
          value={this.state.courseType}
          changeValue={ (name, value) => { this.changeValue(name, value); } }
        />

        <Image
          name="image"
          label="Image"
          ref="courseDescriptionImg"
          error={sectionHelper.getError("image", this.props.errors)}
          value={this.state.image}
          changeValue={ (name, value) => { this.changeValue(name, value); } }
        />

        <ReactQuill
          name="note"
          label="Note"
          ref="note"
          error={sectionHelper.getError("note", this.props.errors)}
          value={this.state.note}
          changeValue={ (name, value) => { this.changeValue(name, value); } }
        />

        <ReactQuill
          name="description"
          label="Description"
          ref="description"
          error={sectionHelper.getError("description", this.props.errors)}
          value={this.state.description}
          changeValue={ (name, value) => { this.changeValue(name, value); } }
        />

        <ReactQuill
          name="price"
          label="Prix"
          ref="price"
          error={sectionHelper.getError("price", this.props.errors)}
          value={this.state.price}
          changeValue={ (name, value) => { this.changeValue(name, value); } }
        />
      </div>
    );
  }
}