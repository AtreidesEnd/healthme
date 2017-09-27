import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import DropdownList from 'react-widgets/lib/DropdownList';

export default class Trends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      selectedOutcome: null,
      outcomesDropdown: [],
      trendData: {},
    };
  }

  componentDidMount() {
    this.getOutcomesForUser();
  }

  getOutcomesForUser() {
    axios.get('/api/outcomes', {headers: {'Authorization': 'bearer ' + this.props.auth()}})
      .then(resp => {
        const data = resp.data;
        let outcomes = [];
        data.feelPhys.forEach((feeling) => outcomes.push({group: 'Physical', text: feeling}));
        data.feelEmos.forEach((feeling) => outcomes.push({group: 'Emotional', text: feeling}));
        data.feelIlls.forEach((feeling) => outcomes.push({group: 'Illness', text: feeling}));
        this.setState({outcomes: outcomes});
      })
      .catch(err => console.log('Error: ', err));
  }

  getTrendData() {
    axios.get('/api/trenddata', {
      params: {outcome: this.state.selectedOutcome, includeRaw: true},
      headers: {'Authorization': 'bearer ' + this.props.auth()}
    }).then(resp => {
      this.setState({trendData: resp.data});
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
              this.setState({selectedOutcome}, this.getTrendData);
            }} />
        </div>
        <div className="trends-summary-container">
          {this.state.trendData.drivers && this.state.trendData.drivers.length ?
            <TrendTable data={this.state.trendData} /> :
            <div className="trends-table-placeholder">
              Make a selection above to see the things that may be driving how you feel.
            </div>}
          {_.some([this.state.trendData.overall, this.state.trendData.move, this.state.trendData.sleep, this.state.trendData.water]) ?
            <AvgTable data={this.state.trendData} /> : null
          }
        </div>
      </div>
    );
  }
}

const TrendTable = ({data}) => {
  return (
    <div className="trends-table-container">
      <table className="trends-table mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
        <thead>
          <tr>
            <th className="trends-table-header mdl-data-table__cell--non-numeric">Driver</th>
            <th className="trends-table-header">Count</th>
          </tr>
        </thead>
        <tbody>
          {data.drivers.map(d => (
            <tr key={`tr-${d[0]}`}><td className="trends-table-data mdl-data-table__cell--non-numeric">{d[0]}</td>
              <td className="trends-table-data">{d[1]}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AvgTable = ({data}) => {
  return (
    <div className="trends-table-avg-container shadow">
      <div className="trends-table-avg-header">
        <span>Daily averages on associated entries:</span>
      </div>
      {data.overall && <div className="trends-table-avg-row">
        <span className="trends-table-avg-label">Overall Rating:</span>
        <span className="trends-table-avg-value">{` ${Math.round(data.overall * 100) / 100}/5`}</span>
      </div>}
      {data.sleep && <div className="trends-table-avg-row">
        <span className="trends-table-avg-label">Sleep (hrs):</span>
        <span className="trends-table-avg-value">{` ${Math.round(data.sleep * 100) / 100}`}</span>
      </div>}
      {data.move && <div className="trends-table-avg-row">
        <span className="trends-table-avg-label">Movement (mins):</span>
        <span className="trends-table-avg-value">{` ${Math.round(data.move * 100) / 100}`}</span>
      </div>}
      {data.water && <div className="trends-table-avg-row">
        <span className="trends-table-avg-label">Water (liters):</span>
        <span className="trends-table-avg-value">{` ${Math.round(data.water * 100) / 100}`}</span>
      </div>}
    </div>
  );
};
