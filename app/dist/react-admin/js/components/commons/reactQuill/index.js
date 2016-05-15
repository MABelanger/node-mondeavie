var ReactQuill =                  require('react-quill');
import React                      from "react";


import "react-quill/node_modules/quill/dist/quill.snow.css";
import "./quill.css"

export default class Admin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      description: ""
    };
  }

  getOnlyRedInlineStyle(html) {
    /* TODO use regex for clean the code
    var findRed = '<span style="color: rgb\(161, 50, 50\);">';
    var regRed = new RegExp(findRed, 'g');

    var findBlack = '<span style="color: rgb\(0, 0, 0\);">';
    var regBlak = new RegExp(findBlack, 'g');
    */

    // replace the inline style red by <red>
    let noInlineColors = html.replace(/<span style="color: rgb\(161, 50, 50\);">/g, '<red>');//
    noInlineColors = noInlineColors.replace(/<span style="color: rgb\(0, 0, 0\);">/g, '<black>'); // span class="autoColor"

    // remove all inline styles
    let noInlineStyle = noInlineColors.replace(/style=\"[^\"]*\"/i, '');

    // re add the inline style of red
    let addRed = noInlineStyle.replace(/<red>/g, '<span style="color: rgb(161, 50, 50);">');//
    // the empty span is automatically removed by quill
    let removeBlack = addRed.replace('<black>', '<span>');

    return removeBlack;
  }

  handleChange(e) {
    // set the value
    let value = this.getOnlyRedInlineStyle(e);
    this.props.changeValue(this.props.name, value);
  }


  initToolbars(){
    this.menuColors = [
      'rgb(  0,   0,   0)',
      'rgb(161,  50,  50)'
    ].map(function(color){ return { value: color } });

    this.toolbarItems = [
      { label:'Text', type:'group', items: [
        { type:'bold', label:'Bold' },
        { type:'italic', label:'Italic' },
        { type:'strike', label:'Strike' },
        { type:'underline', label:'Underline' },
        { type:'separator' },
        { type:'color', label:'Color', items:this.menuColors },

        { type:'separator' },
        { type:'link', label:'Link' }
      ]},

      { label:'Blocks', type:'group', items: [
        { type:'bullet', label:'Bullet' },
        { type:'separator' },
        { type:'list', label:'List' }
      ]},
    ];
  }

  render() {
    this.initToolbars();

    var wrapperClass = 'form-group';
    if (this.props.error && this.props.error.length > 0) {
      wrapperClass += " " + 'has-error';
    }
    return (
      <div className="form-horizontal">
        <div className={wrapperClass}>
          <label htmlFor={this.props.name} className="control-label col-xs-2">
            {this.props.label} :
          </label>
          <div className="col-sm-10">
            <ReactQuill
              theme="snow"
              ref={this.props.name}
              value={this.props.value}
              onChange={this.handleChange.bind(this)}
              >
              <ReactQuill.Toolbar key="toolbar"
                                  ref="toolbar"
                                  items={this.toolbarItems} />
              <div key="editor"
                   ref="editor"
                   className="quill-contents"
              />
            </ReactQuill>
          </div>
        </div>
      </div>
    );
  }
}

