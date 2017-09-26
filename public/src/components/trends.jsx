import React, { Component } from 'react';
import axios from 'axios';
import DropdownList from 'react-widgets/lib/DropdownList';

export default class Trends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      selectedOutcome: '',
      outcomesDropdown: [],
    };
  }

  componentDidMount() {
    this.getOutcomesForUser();
    // TODO: decide if we want to prepopulate the component on mount
    // axios.get('/api/entries', {params: {limit: 5}}).then(resp => {
    //   console.log(resp);
    //   this.setState({entries: resp.data});
    // });
  }

  getOutcomesForUser(user = 'user1') {
    axios.get('/api/outcomes', {params: {user: user}})
      .then(resp => {
        const data = resp.data;
        let outcomes = [];
        console.log(data);
        console.log(data.feelPhys);
        data.feelPhys.forEach((feeling) => outcomes.push({group: 'Physical', text: feeling}));
        data.feelEmos.forEach((feeling) => outcomes.push({group: 'Emotional', text: feeling}));
        data.feelIlls.forEach((feeling) => outcomes.push({group: 'Illness', text: feeling}));
        this.setState({outcomes: outcomes});
      })
      .catch(err => console.log('Error: ', err));
  }

  render() {
    return (
      <div className="journal-container shadow">
        <div className="journal-header">
          <span className="trends-header-title">What's behind my: </span>
          <DropdownList id="outcome-select" name="outcome-select" className="trends-outcome-select"
            value={this.state.selectedOutcome} data={this.state.outcomes}
            textField="text" groupBy="group"
            onChange={sel => {
              console.log(sel.text);
              this.setState({selectedOutcome: sel.text});
            }} />
        </div>
        <div className="trends-table-container">Trends table goes here - woohoo</div>
      </div>
    );
  }
}
