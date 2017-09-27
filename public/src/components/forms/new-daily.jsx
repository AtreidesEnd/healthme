import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import simpleNumberLocalizer from 'react-widgets-simple-number';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import NumberPicker from 'react-widgets/lib/NumberPicker';
import { TextFieldInput, TextAreaInput, RatingInput } from './form-helpers.jsx';
simpleNumberLocalizer();
moment.locale('en');
momentLocalizer(moment);

export default class NewDaily extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // form data
      datetime: new Date(), title: '', desc: '',
      overall: 0, water: 0, sleep: 0, move: 0,
      // form config
      dailyMoveTarget: 0,
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
      params: {type: 'daily', user: 'user1'},
      headers: {'Authorization': 'bearer ' + this.props.auth()}
    })
      .then(resp => {
        this.setState({
          dailyMoveTarget: resp.data.dailyMoveTarget
        });
      }).catch(err => console.log('Error: ', err));
  }

  handleSubmit(e) {
    e && e.preventDefault();
    let formData = {
      type: 'Daily', title: this.state.title, desc: this.state.desc,
      datetime: this.state.datetime, details: {
        overall: this.state.overall, water: this.state.water,
        sleep: this.state.sleep, move: this.state.move}
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
        <div className="new-entry-header"><span>New Daily</span></div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <div className="inline-form">
            <TextFieldInput id="title" name="title" label="Title" value={this.state.title}
              onChange={e => this.setState({ title: e.target.value})} />
            <DateTimePicker id="datetime" name="datetime" className="new-entry-datetime"
              value={this.state.datetime} onChange={datetime => this.setState({ datetime })}/>
          </div>
          <TextAreaInput id="desc" name="desc" label="Daily Log" value={this.state.desc}
            onChange={e => this.setState({ desc: e.target.value})} />
          <RatingInput id="overall-rating" name="overall-rating" label="Overall Feeling:"
            value={this.state.overall} onChange={overall => this.setState({overall})} />
          <div className="inline-form">
            <div className="inline-form-group">
              <div className="inline-form-label">Sleep (hrs):</div>
              <NumberPicker id="sleep" name="sleep" className="new-entry-form-numpick"
                step={1} min={0} onChange={sleep => this.setState({sleep})}
                format="####"
              />
            </div>
            <div className="inline-form-group">
              <div className="inline-form-label">Water (L):</div>
              <NumberPicker id="water" name="water" className="new-entry-form-numpick"
                step={1} min={0} onChange={water => this.setState({water})}
                format="####"
              />
            </div>
            <div className="inline-form-group">
              <div className="inline-form-label">Movement (min):</div>
              <NumberPicker id="movement" name="movement" className="new-entry-form-numpick"
                step={15} min={0} onChange={move => this.setState({move})}
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
