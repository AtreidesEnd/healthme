import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Multiselect from 'react-widgets/lib/Multiselect';
import { TextFieldInput, TextAreaInput } from './form-helpers.jsx';

moment.locale('en');
momentLocalizer(moment);

const allergens = ['Gluten', 'Red meat', 'Dairy', 'Nuts'];
const preps = ['Grilled', 'Fried', 'Baked', 'Steamed'];

export default class NewMeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // form data
      datetime: new Date(), title: '', desc: '',
      allergens: [], preps: [],
      // form config
      allerOpts: [], prepOpts: []
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
    axios.get('/api/formconfig', {
      params: {type: 'meal', user: 'user1'},
      headers: {'Authorization': 'bearer ' + this.props.auth()}
    }).then(resp => {
      this.setState({
        allerOpts: resp.data.allergens,
        prepOpts: resp.data.preps,
      });
    }).catch(err => console.log('Error: ', err));
  }

  handleSubmit(e) {
    e && e.preventDefault();
    let formData = {
      type: 'Meal', title: this.state.title, desc: this.state.desc,
      datetime: this.state.datetime, details: {
        allergens: this.state.allergens, preps: this.state.preps}
    };
    axios.post('/api/entries', formData, {headers: {'Authorization': 'bearer ' + this.props.auth()}})
      .then((res) => this.props.history.push({pathname: '/'}))
      .catch((err) => console.log('error: ', err));
  }

  handleCancel(e) {
    e && e.preventDefault();
    this.props.history.push({pathname: '/'});
  }

  render() {
    return (
      <div className="new-entry-form-div shadow">
        <div className="new-entry-header"><span>New Meal</span></div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <div className="inline-form">
            <TextFieldInput id="title" name="title" label="Title" value={this.state.title}
              onChange={e => this.setState({ title: e.target.value})} />
            <DateTimePicker id="datetime" name="datetime" className="new-entry-datetime"
              value={this.state.datetime} onChange={datetime => this.setState({ datetime })}/>
          </div>
          <TextAreaInput id="desc" name="desc" label="Description" value={this.state.desc}
            onChange={e => this.setState({ desc: e.target.value})} />
          <div className="inline-form">
            <div className="inline-form-label">Allergens:</div>
            <Multiselect id="allergens" name="allergens" className="new-entry-form-select"
              data={this.state.allerOpts} value={this.state.allergens}
              onChange={allergens => this.setState({allergens})} />
          </div>
          <div className="inline-form">
            <div className="inline-form-label">Preps:</div>
            <Multiselect id="preps" name="preps" className="new-entry-form-select"
              data={this.state.prepOpts} value={this.state.preps}
              onChange={preps => this.setState({preps})} />
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
