import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Multiselect from 'react-widgets/lib/Multiselect';
import Rating from 'react-rating';

moment.locale('en');
momentLocalizer(moment);

const physicals = ['Great', 'Stomach ache', 'Bloated', 'Headache', 'Tired', 'Sore', 'Hungry'];
const emotionals = ['Happy / Balanced', 'Sad / Depressed', 'Nervous / Stressed', 'Grumpy / Irritated', 'Bored', 'Meh / Numb'];
const ills = ['Cold', 'Fever', 'Cough', 'Sore Throat', 'Indigestion'];

export default class NewFeeling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: new Date(), title: '', desc: '',
      overall: 0, physicals: [], emotionals: [], ills: []
    };
  }

  componentDidMount() {
    window.componentHandler.upgradeElements(findDOMNode(this));
  }
  componentWillUnmount() {
    const element = findDOMNode(this);
    window.componentHandler.downgradeElements(element);
  }

  handleSubmit(e) {
    console.log(e);
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
              <TextFieldInput id="title" name="title" label="Title" value={this.state.title} onChange={e => this.setState({ title: e.target.value})} />
              <DateTimePicker className="new-entry-datetime" name="datetime" value={this.state.datetime} onChange={datetime => this.setState({ datetime })}/>
            </div>
            <TextAreaInput id="desc" name="desc" label="Description" value={this.state.desc} onChange={e => this.setState({ desc: e.target.value})} />
            <RatingInput value={this.state.overall} id="overall-rating" name="overall-rating"
              label="Overall Feeling:" onChange={overall => this.setState({overall})} />
            <div className="inline-form">
              <div className="inline-form-label">Physical:</div>
              <Multiselect name="physicals" className="new-entry-form-select" name="physicals" data={physicals} value={this.state.physicals} onChange={physicals => this.setState({physicals})} />
            </div>
            <div className="inline-form">
              <div className="inline-form-label">Emotional:</div>
              <Multiselect name="emotionals" className="new-entry-form-select" name="emotionals" data={emotionals} value={this.state.emotionals} onChange={emotionals => this.setState({emotionals})} />
            </div>
            <div className="inline-form">
              <div className="inline-form-label">Illness:</div>
              <Multiselect name="ills" className="new-entry-form-select" name="ills" data={ills} value={this.state.ills} onChange={ills => this.setState({ills})} />
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

const RatingInput = ({value, onChange, id, name, label}) => {
  return (
    <div className='inline-form'>
      <div className="inline-form-label">{label}</div>
      <Rating className="new-entry-form-rating" id={id} name={name} onChange={onChange}
        initialRate={value} start={0} stop={5} />
    </div>
  );
};

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
        type="text" rows="2" value={value} onChange={onChange}>
      </textarea>
    </div>
  );
};
