import React                      from "react";
import BtnInfo                    from "../../commons/BtnInfo";
import BtnDanger                  from "../../commons/BtnDanger";

export default class CtrlSaveDel extends React.Component {
  constructor(props) {
    super(props);
  }


  getBtns(){
    return(
      <div className="btn-toolbar">
        <BtnInfo
          onClick={ (e)=>{ this.props.onSave(e); } }
          label="Sauvegarder"
        />
        <BtnDanger
          onClick={ (e)=>{ this.props.onDelete(e); } }
          label="X"
        />
      </div>
    );
  }

  render() {
    if(this.props.noRow == true) {
      return this.getBtns();
    } else {
      return (
        <div className="clearfix">
          <div className="form-horizontal">
            <div className="form-group">
              <div className="col-xs-offset-2 col-xs-10">
                {this.getBtns()}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
