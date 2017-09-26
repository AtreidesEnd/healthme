import React, { Component } from 'react';
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

export default class NewDaily extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: new Date(), title: '', desc: '',
      overall: null, physicals: [], emotionals: [], ills: []
    };
  }

  render() {
    return (
      <div className="new-entry-form-div shadow">
        <div className="new-entry-header"><span>New Daily</span></div>
        <form onSubmit={this.onSubmit}>
          <div className="inline-form">
            <TextFieldInput id="title" name="title" label="Title" value={this.state.title} onChange={e => this.setState({ title: e.target.value})} />
            <DateTimePicker className="new-entry-datetime" name="datetime" value={this.state.datetime} onChange={datetime => this.setState({ datetime })}/>
          </div>
          <TextAreaInput id="desc" name="desc" label="Daily Log" value={this.state.desc} onChange={e => this.setState({ desc: e.target.value})} />
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
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Cancel</button>
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Submit</button>
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
        placeholderRate={value} start={0} stop={5} />
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
    <div className="new-entry-form-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <label htmlFor={id} className="new-entry-text-label mdl-textfield__label">{label}</label>
      <textarea id={id} name={name} className="new-entry-text-input mdl-textfield__input"
        type="text" rows="2" value={value} onChange={onChange}>
      </textarea>
    </div>
  );
};
