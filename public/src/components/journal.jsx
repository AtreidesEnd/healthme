import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Menu from './menu.jsx';
import moment from 'moment';

const iconTypeMap = {
  'Activity': 'directions_run',
  'Daily': 'brightness_4',
  'Feeling': 'mood',
  'Meal': 'local_pizza'
};

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

const JournalEntry = ({entry}) => {
  return (
    <li className="journal-entry mdl-list__item mdl-list__item--three-line">
      <div className="journal-entry-icon-div">
        <i className="journal-entry-icon material-icons mdl-list__item-avatar">{iconTypeMap[entry.type]}</i>
      </div>
      <div className="journal-entry-content">
        <div className="journal-entry-title">{`${entry.type} - ${entry.title}`}</div>
        <div className="journal-entry-desc mdl-list__item-text-body">{entry.desc}</div>
        <Details details={entry.details} type={entry.type} />
      </div>
      <div className="journal-entry-time mdl-list__item-secondary-content">
        {moment(entry.datetime).calendar()}
      </div>
    </li>
  );
};

const Details = ({details, type}) => {
  let content;
  if (type === 'Daily') {
    const overall = details.overall ?
      <span key='ovr' className="entry-detail">{`Overall: ${details.overall}/5`}</span> : null;
    const water = <span key='wtr' className="entry-detail">{`Water: ${details.water || 0} litres`}</span>;
    const sleep = <span key='slp' className="entry-detail">{`Sleep: ${details.sleep || 0} hours`}</span>;
    const move = <span key='mv' className="entry-detail">{`Movement: ${details.move || 0} min`}</span>;
    content = [overall, water, sleep, move];
  } else if (type === 'Activity') {
    const types = (details.activityTypes && details.activityTypes.length) ?
      (<span key='act' className="entry-detail">{`Types: ${details.activityTypes.join(', ')}`}</span>) : null;
    const intensity = details.intensity ?
      (<span key='int' className="entry-detail">{`Intensity: ${details.intensity}`}</span>) : null;
    const duration = details.duration ?
      (<span key='dur' className="entry-detail">{`Duration: ${details.duration} min`}</span>) : null;
    content = [types, intensity, duration];
  } else if (type === 'Meal') {
    const allergens = (details.allergens && details.allergens.length) ?
      (<span key='aller' className="entry-detail">{`Allergens: ${details.allergens.join(', ')}`}</span>) : null;
    const preps = (details.preps && details.preps.length) ?
      (<span key='prep' className="entry-detail">{`Preps: ${details.preps.join(', ')}`}</span>) : null;
    content = [allergens, preps];
  } else if (type === 'Feeling') {
    const overall = details.overall ?
      <span key='ovr' className="entry-detail">{`Overall: ${details.overall}/5`}</span> : null;
    const phys = (details.physicals && details.physicals.length) ?
      (<span key='phys' className="entry-detail">{`Physical: ${details.physicals.join(', ')}`}</span>) : null;
    const emo = (details.emotionals && details.emotionals.length) ?
      (<span key='emo' className="entry-detail">{`Emotional: ${details.emotionals.join(', ')}`}</span>) : null;
    const ill = (details.ills && details.ills.length) ?
      (<span key='ill' className="entry-detail">{`Illness: ${details.ills.join(', ')}`}</span>) : null;
    content = [overall, phys, emo, ill];
  }
  return details ? (<div className="journal-entry-details">{content}</div>) : null;
};
