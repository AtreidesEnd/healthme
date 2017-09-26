import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Multiselect from 'react-widgets/lib/Multiselect';

moment.locale('en');
momentLocalizer(moment);

const allergens = ['Gluten', 'Red meat', 'Dairy', 'Nuts'];
const preps = ['Grilled', 'Fried', 'Baked', 'Steamed'];

export default class NewMeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: new Date(), title: '', desc: '',
      allergens: [], preps: [],
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
      type: 'Meal', title: this.state.title, desc: this.state.desc,
      datetime: this.state.datetime, details: {
        allergens: this.state.allergens, preps: this.state.preps}
    };
    axios.post('/api/entries', formData)
      .then((res) => this.setState({submitSuccess: true}))
      .catch((err) => console.log('error: ', err));
  }


  render() {
    return (this.state.submitSuccess) ?
      (
        <div className="new-entry-success">
          Entry saved!
          {this.props.redirect()}
        </div>
      ) : (
        <div className="new-entry-form-div shadow">
          <div className="new-entry-header"><span>New Meal</span></div>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div className="inline-form">
              <TextFieldInput id="title" name="title" label="Title" value={this.state.title} onChange={e => this.setState({ title: e.target.value})} />
              <DateTimePicker className="new-entry-datetime" name="datetime" value={this.state.datetime} onChange={datetime => this.setState({ datetime })}/>
            </div>
            <TextAreaInput id="desc" name="desc" label="Description" value={this.state.desc} onChange={e => this.setState({ desc: e.target.value})} />
            <div className="inline-form">
              <div className="inline-form-label">Allergens:</div>
              <Multiselect name="allergens" className="new-entry-form-select" name="allergens" data={allergens} value={this.state.allergens} onChange={allergens => this.setState({allergens})} />
            </div>
            <div className="inline-form">
              <div className="inline-form-label">Preps:</div>
              <Multiselect name="preps" className="new-entry-form-select" data={preps} value={this.state.preps} onChange={preps => this.setState({preps})} />
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
