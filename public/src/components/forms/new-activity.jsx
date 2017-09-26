import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import DropdownList from 'react-widgets/lib/DropdownList';
import Multiselect from 'react-widgets/lib/Multiselect';
import NumberPicker from 'react-widgets/lib/NumberPicker';
import simpleNumberLocalizer from 'react-widgets-simple-number';
simpleNumberLocalizer();
moment.locale('en');
momentLocalizer(moment);

export default class NewActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // form data
      datetime: new Date(), title: '', desc: '',
      activityTypes: [], intensity: '', duration: 0,
      submitSuccess: false,
      // form config
      actTypeOpts: [], intensityOpts: []
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
    axios.get('/api/formconfig', {params: {type: 'activity', user: 'user1'}})
      .then(resp => {
        this.setState({
          actTypeOpts: resp.data.actTypes,
          intensityOpts: resp.data.actInts
        });
      }).catch(err => console.log('Error: ', err));
  }

  handleSubmit(e) {
    e && e.preventDefault();
    let formData = {
      type: 'Activity', title: this.state.title, desc: this.state.desc,
      datetime: this.state.datetime, details: {
        activityTypes: this.state.activityTypes, intensity: this.state.intensity,
        duration: this.state.duration}
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
          <div className="new-entry-header"><span>New Activity</span></div>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div className="inline-form">
              <TextFieldInput id="title" name="title" label="Title" value={this.state.title}
                onChange={e => this.setState({title: e.target.value})} />
              <DateTimePicker id="datetime" name="datetime" className="new-entry-datetime" 
                value={this.state.datetime} onChange={datetime => this.setState({ datetime: datetime })}/>
            </div>
            <TextAreaInput id="desc" name="desc" label="Description" value={this.state.desc}
              onChange={e => this.setState({ desc: e.target.value})} />
            <div className="inline-form">
              <div className="inline-form-label">Activity Types:</div>
              <Multiselect name="activity-types" className="new-entry-form-select"
                name="activity-types" data={this.state.actTypeOpts} value={this.state.activityTypes}
                onChange={activityTypes => this.setState({activityTypes: activityTypes})} />
            </div>
            <div className="inline-form">
              <div className="inline-form-group">
                <div className="inline-form-label">Intensity:</div>
                <DropdownList name="intensity" className="new-entry-form-select"
                  data={this.state.intensityOpts} value={this.state.intensity}
                  onChange={intensity => this.setState({intensity})} />
              </div>
              <div className="inline-form-group">
                <div className="inline-form-label">Duration (min):</div>
                <NumberPicker name="duration" className="new-entry-form-numpick"
                  step={15} min={0} onChange={duration => this.setState({duration})}
                  format="####"
                />
              </div>
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

const TextFieldInput = ({value, onChange, id, name, label}) => {
  return (
    <div className="new-entry-form-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <label htmlFor={id} className="new-entry-text-label mdl-textfield__label">{label}</label>
      <input id={id} name={name} className="new-entry-text-input mdl-textfield__input"
        type="text" value={value}
        onChange={onChange}
      />
    </div>
  );
};

const TextAreaInput = ({value, onChange, id, name, label}) => {
  return (
    <div className="new-entry-form-textarea mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <label htmlFor={id} className="new-entry-text-label mdl-textfield__label">{label}</label>
      <textarea id={id} name={name} className="new-entry-text-input mdl-textfield__input"
        type="text" rows="3" value={value} onChange={onChange}>
      </textarea>
    </div>
  );
};
