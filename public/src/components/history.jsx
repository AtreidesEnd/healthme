import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Menu from './menu.jsx';
import JournalEntry from './journal-entry.jsx';
import moment from 'moment';

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    axios.get('/api/entries', {
      params: {limit: 100},
      headers: {'Authorization': 'bearer ' + this.props.auth()}
    }).then(resp => {
      this.setState({entries: resp.data});
    });
  }

  render() {
    return (
      <div className="journal-container shadow">
        <div className="journal-header">
          <span className="journal-header-title">Last {this.state.entries.length} journal entries...</span>
        </div>
        <ul className="mdl-list journal-list">
          {this.state.entries && this.state.entries.map((entry, i) => <JournalEntry entry={entry} key={`jrn${i}`}/>)}
        </ul>
      </div>
    );
  }
}
