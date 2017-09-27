import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Multiselect from 'react-widgets/lib/Multiselect';
import { TextFieldInput, TextAreaInput, RatingInput } from './form-helpers.jsx';
moment.locale('en');
momentLocalizer(moment);

export default class NewFeeling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // form data
      datetime: new Date(), title: '', desc: '',
      overall: 0, physicals: [], emotionals: [], ills: [],
      // form config
      physOpts: [], emoOpts: [], illOpts: [],
    };
  }

  componentDidMount() {
    window.componentHandler.upgradeElements(findDOMNode(this));
    this.getFormConfig();
  }

  componentWillUnmount() {
    const element = findDOMNode(this);
    window.componentHandler.downgradeElements(element);
  }

  getFormConfig() {
    axios.get('/api/formconfig', {params: {type: 'feeling', user: 'user1'}})
      .then(resp => {
        this.setState({
          physOpts: resp.data.feelPhys,
          emoOpts: resp.data.feelEmos,
          illOpts: resp.data.feelIlls,
        });
      }).catch(err => console.log('Error: ', err));
  }

  handleSubmit(e) {
    e && e.preventDefault();
    let formData = {
      type: 'Feeling', title: this.state.title, desc: this.state.desc,
      datetime: this.state.datetime, details: {
        overall: this.state.overall, physicals: this.state.physicals,
        emotionals: this.state.emotionals, ills: this.state.ills}
    };
    axios.post('/api/entries', formData)
      .then((res) => this.setState({submitSuccess: true}))
      .catch((err) => console.log('error: ', err));
  }

  handleCancel(e) {
    e && e.preventDefault();
    this.setState({submitCancel: true});
  }

  render() {
    return (this.state.submitSuccess || this.state.submitCancel) ?
      (
        <div className="new-entry-success">
          Entry saved!
          {this.props.redirect()}
        </div>
      ) : (
        <div className="new-entry-form-div shadow">
          <div className="new-entry-header"><span>New Feeling</span></div>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div className="inline-form">
              <TextFieldInput id="title" name="title" label="Title" value={this.state.title}
                onChange={e => this.setState({ title: e.target.value})} />
              <DateTimePicker id="datetime" name="datetime" className="new-entry-datetime"
                value={this.state.datetime} onChange={datetime => this.setState({ datetime })}/>
            </div>
            <TextAreaInput id="desc" name="desc" label="Description" value={this.state.desc}
              onChange={e => this.setState({ desc: e.target.value})} />
            <RatingInput id="overall-rating" name="overall-rating" label="Overall Feeling:"
              value={this.state.overall} onChange={overall => this.setState({overall})} />
            <div className="inline-form">
              <div className="inline-form-label">Physical:</div>
              <Multiselect id="physicals" name="physicals" className="new-entry-form-select"
                name="physicals" data={this.state.physOpts} value={this.state.physicals}
                onChange={physicals => this.setState({physicals})} />
            </div>
            <div className="inline-form">
              <div className="inline-form-label">Emotional:</div>
              <Multiselect id="emotionals" name="emotionals" className="new-entry-form-select"
                data={this.state.emoOpts} value={this.state.emotionals}
                onChange={emotionals => this.setState({emotionals})} />
            </div>
            <div className="inline-form">
              <div className="inline-form-label">Illness:</div>
              <Multiselect id="ills" name="ills" className="new-entry-form-select"
                data={this.state.illOpts} value={this.state.ills}
                onChange={ills => this.setState({ills})} />
            </div>
            <div className="new-entry-form-submit-div">
              <button onClick={(e) => this.handleCancel(e)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Cancel</button>
              <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Submit</button>
            </div>
          </form>
        </div>
      );
  }
}
