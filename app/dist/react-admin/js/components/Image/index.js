// inspired by : https://gist.githubusercontent.com/hartzis/0b77920380736f98e4f9/raw/92049c0c4400edf3d889fece1acd8e981c3aa243/ImageUploadComponent.jsx
import React                      from "react";
import "./style.css"

import BtnInfo                    from "../commons/BtnInfo";

export default class ImageUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
    this._inputFileChange = this._inputFileChange.bind(this);
  }

  _inputFileChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      let dataUri = reader.result;
      let name = this.props.name;

      this.setState({
        file: file,
      });

      // build the image for changeValue()
      let image = {
        dataUri: dataUri,
        fileName: file.name,
        url: null
      }
      this.props.changeValue(name, image);
    }

    reader.readAsDataURL(file)
  }

  _getFileNameUrl(url){
    return url.substring(url.lastIndexOf('/')+1);
  }

  _getFileNameFReader(file){
    return file.name;
  }

  _click(){
    //document.getElementById('fileCourseID').click();
    this.refs.inputFile.click();
    return false;
  }


  _renderImagePreview(){
    let fileName = null;
    let imgSrc = null;

    // build the right imagePreview

    if (this.props.value) {
      if (this.props.value.url) {
        imgSrc = 'http://localhost:3000/' + this.props.value.url;
        fileName = this._getFileNameUrl(this.props.value.url);

      } else if (this.props.value.dataUri) {
        imgSrc = this.props.value.dataUri;
        fileName = this._getFileNameFReader(this.state.file);

      } else {
        return '';
      }
  
    } else {
      return '';
    }

    return (
      <div>
        <img src={imgSrc} />
        <div>{fileName}</div>
      </div>
    );
  }

  _renderInputFile(){
    return (
      <div>
        <BtnInfo 
          label="Rechercher"
          onClick={(e) => {this._click();} }
        />
        <input 
          type="file"
          ref="inputFile"
          onChange={this._inputFileChange}
        />
      </div>
    );
  }

  render() {
    let wrapperClass = 'form-group';
    if (this.props.error && this.props.error.length > 0) {
      wrapperClass += " " + 'has-error';
    }

    return (
      <div className="form-horizontal">
        <div className={wrapperClass}>
          <label htmlFor={this.props.name} className="control-label col-xs-2">
            <br />
            {this.props.label} :
          </label>
          <div className="col-sm-10">
            &nbsp;
            <div className="imgPreview">
              { this._renderInputFile() }
              { this._renderImagePreview() }
            </div>
          </div>
        </div>
      </div>
    );
  }

}