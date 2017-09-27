import React, { Component } from 'react';
import axios from 'axios';
import DropdownList from 'react-widgets/lib/DropdownList';

export default class Trends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      selectedOutcome: null,
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

  getTrendData(user = 'user1') {
    console.log('This state outcome is: ', this.state.selectedOutcome);
    console.log('Getting trend data for: ', user, ' and outcome: ', this.state.selectedOutcome);
    axios.get('/api/trenddata', {params: {user: user, outcome: this.state.selectedOutcome, includeRaw: true}})
      .then(resp => {
        console.log('TrendData Response: ', resp);
      }).catch(err => console.log(err));
  }

  render() {
    return (
      <div className="journal-container shadow">
        <div className="journal-header">
          <div className="trends-header-title">What's behind my: </div>
          <DropdownList id="outcome-select" name="outcome-select" className="trends-outcome-select"
            value={this.state.selectedOutcome} data={this.state.outcomes}
            textField="text" groupBy="group"
            onChange={selectedOutcome => {
              console.log(selectedOutcome);
              this.setState({selectedOutcome}, this.getTrendData);
            }} />
        </div>
        <div className="trends-table-container">Trends table goes here - woohoo</div>
      </div>
    );
  }
}

const TrendTable = () => {
  return (
    <div className="trend-table-container">
      <table class="trend-table mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
        <thead>
          <tr>
            <th class="trend-table-header mdl-data-table__cell--non-numeric">Material</th>
            <th>Quantity</th>
            <th>Unit price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="trend-table-data mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
            <td>25</td>
            <td>$2.90</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

};
