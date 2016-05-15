import React                      from "react";
import BtnInfo                    from "../../commons/BtnInfo";

export default class CtrlModNew extends React.Component {

 // TODO : change CtrlModNew value by isExist
  render() {
    return (
      <div className="clearfix">
        <div className="form-horizontal">
          <div className="form-group">
            <div className="col-xs-offset-2 col-xs-10">
              <h4>{this.props.title}</h4>
              <div className="btn-toolbar">
                <BtnInfo
                  label="Modifier"
                  disabled={ !this.props.value }
                  onClick={(e) => {this.props.onModify();} }
                />
                <BtnInfo 
                  label="Nouveau"
                  disabled={ this.props.value }
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