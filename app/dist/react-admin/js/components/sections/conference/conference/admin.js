import React                          from "react";
import toastr                         from 'toastr';

import ConferenceSection              from "./section";

import * as sectionHelper             from "../../helper";

// Flux Conference
import ConferenceStore                from '../../../../stores/conference/conferenceStore';
import * as ConferenceActions         from '../../../../actions/conference/conferenceActions';
import ConferenceConstants            from '../../../../constants/conference/conferenceConstants';

// CSS
import 'toastr/build/toastr.css';

const CONFERENCE_LISTNER_FCT_NAMES = [
  { 
    storeFctAdd:'addSavedListener',
    storeFctRemove:'removeSavedListener',
    listenerFct: 'onSaved'
  },
  {
    storeFctAdd:'addDeletedListener',
    storeFctRemove:'removeDeletedListener',
    listenerFct: 'onDeleted'
  },
  { 
    storeFctAdd:'addErrorListener',
    storeFctRemove:'removeErrorListener',
    listenerFct: 'onError'
  }
];

export default class ConferenceAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.conferenceListnerFctRemoveNames = null;
    this.state = {
      toastrMsg: {},
      errors: {},
    };
  }

  componentWillMount() {
    this.mounted = true;

    // Conference
    this.conferenceListnerFctRemoveNames = 
      sectionHelper.addListeners(ConferenceStore, CONFERENCE_LISTNER_FCT_NAMES, this);
  }

  componentWillUnmount() {
    this.mounted = false;

    // Conference
    sectionHelper.removeListeners(ConferenceStore, this.conferenceListnerFctRemoveNames);
  }

  _resetMsg(){
    this.setState({
      toastrMsg: {},
      errors: {}
    });
  }

  select(conference){
    this.props.setConference(conference);
    this._resetMsg();
  }

  new(){
    this.props.setConference({});
    this._resetMsg();
  }

  /*
   * listener called by the store
   */

  onSaved(){
    this._resetMsg();
    let toastrMsg = { success : 'La conférence à été sauvegardé.'};

    this.setState({ toastrMsg: toastrMsg });
    this.refs.conferenceSection.hideSection();
  }

  onDeleted(){
    this._resetMsg();
    let toastrMsg = { success : 'La conférence à été supprimé.'};

    this.setState({ toastrMsg: toastrMsg });
    this.refs.conferenceSection.hideSection();
  }

  onError(){
    this._resetMsg();
    let errors = ConferenceStore.getErrors();
    let toastrMsg = { error : "Erreur.<br/>"};

    this.setState({ errors: errors, toastrMsg: toastrMsg });
  }

  /**
   * CRUD Operations
   **/
  // Create
  create(conference){
    ConferenceActions.createConference(conference);
  }

  // Read is admin by the parent component.

  // Update
  save(conference){
    ConferenceActions.saveConference(conference);
  }

  // Delete
  delete(){
    ConferenceActions.deleteConference(this.props.conference);  
  }

  render() {
    return (
      <ConferenceSection
        ref="conferenceSection"
        conferences={this.props.conferences}
        conference={this.props.conference}
        onSelect={this.select.bind(this)}
        onNew={this.new.bind(this)}
        errors={this.state.errors}
        toastrMsg={this.state.toastrMsg}

        onCreate={this.create.bind(this)}
        onSave={this.save.bind(this)}
        onDelete={this.delete.bind(this)}
      />
    );
  }
}

