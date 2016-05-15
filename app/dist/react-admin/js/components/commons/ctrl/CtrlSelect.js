import React                      from "react";
import Dropdown                   from "../../commons/dropdown/Dropdown";
import BtnInfo                    from "../../commons/BtnInfo";

export default class CtrlSelect extends React.Component {

  getLength(){
    if(this.props.list){
      return this.props.list.length;
    }
    return 0;
  }

  isDisabled(){
    return this.getLength() == 0;
  }

  render() {
    return (
      <div className="clearfix">
        <div className="form-horizontal">
          <div className="form-group">
            <div className="col-xs-offset-2 col-xs-10">
              <h4>{this.props.title} ({ this.getLength() })</h4>
              <div className="btn-toolbar">
                <Dropdown
                  disabled={this.isDisabled()}
                  list={this.props.list}
                  label={this.props.title}
                  onSelect={this.props.onSelect}
                  value={this.props.value}
                  cbGetName={this.props.cbGetName}
                  cbGetValue={this.props.cbGetValue}
                />
                <BtnInfo
                  label="Modifier"
                  disabled={!this.props.id}
                  onClick={(e) => {this.props.onModify();} }
                />
                <BtnInfo 
                  label="Nouveau"
                  onClick={(e) => {this.props.onNew();} }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}