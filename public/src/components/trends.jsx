import React, { Component } from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';

export default class Trends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      selectedOutcome: '',
      outcomes: [],
    };
  }

  componentDidMount() {
    // TODO: decide if we want to prepopulate the component on mount
    // axios.get('/api/entries', {params: {limit: 5}}).then(resp => {
    //   console.log(resp);
    //   this.setState({entries: resp.data});
    // });
  }

  getOutcomesForUser(user = 'user1') {
    axios.get('/api/outcomes', {params: {user: user}})
      .then(resp => this.setState({outcomes: resp.data}))
      .catch(err => console.log('Error: ', err));
  }

  render() {
    return (
      <div className="journal-container shadow">
        <div className="journal-header">
          <span className="trends-header-title">What's behind my: </span>
          <DropdownList id="outcome-select" name="outcome-select" className="trends-outcome-select"
            value={this.state.selectedOutcome} data={this.state.outcomes}
            onChange={selectedOutcome => {
              console.log(selected);
              this.setState({selectedOutcome});
            }} />
        </div>
        <div className="trends-table-container">Trends table goes here - woohoo</div>
      </div>
    );
  }


}
