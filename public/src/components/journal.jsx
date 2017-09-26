import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Menu from './menu.jsx';
import JournalEntry from './journal-entry.jsx';
import moment from 'moment';

export default class Journal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    axios.get('/api/entries', {params: {limit: 5}}).then(resp => {
      console.log(resp);
      this.setState({entries: resp.data});
    });
  }

  renderMenu() {
    var children = [
      <Link to="/new/daily" key="daily" className="mdl-menu__item journal-new-menu-item">New Daily</Link>,
      <Link to="/new/feeling" key="feeling" className="mdl-menu__item journal-new-menu-item">New Feeling</Link>,
      <Link to="/new/meal" key="meal" className="mdl-menu__item journal-new-menu-item">New Meal</Link>,
      <Link to="/new/activity" key="activity" className="mdl-menu__item journal-new-menu-item">New Activity</Link>,
    ];
    return <Menu className="journal-new-menu" children={children} ripple={true} target={'new-journal-button'} />;
  }

  render() {
    return (
      <div className="journal-container shadow">
        <div className="journal-header">
          <span className="journal-header-title">Recent journal entries...</span>
          <button id="new-journal-button" className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
            <i className="material-icons">add</i>
          </button>
          {this.renderMenu()}
        </div>
        <ul className="mdl-list journal-list">
          {this.state.entries && this.state.entries.map((entry, i) => <JournalEntry entry={entry} key={`jrn${i}`}/>)}
        </ul>
      </div>
    );
  }
}
