import React from 'react';

const iconTypeMap = {'activity': 'directions_run',
                     'daily': 'brightness_4',
                     'feeling': 'mood',
                     'meal': 'local_pizza'};

const Journal = ({entries}) => (
  <div className="journal-container shadow">
    <div className="journal-header">Recent journal entries...</div>
    <ul className="mdl-list journal-list">
      {entries.map((entry, i) => <JournalEntry entry={entry} key={`jrn${i}`}/>)}
    </ul>
  </div>
);

const JournalEntry = ({entry}) => (
  <li className="mdl-list__item mdl-list__item--three-line journal-entry">
    <span className="mdl-list__item-primary-content">
      <i className="material-icons mdl-list__item-avatar">{iconTypeMap[entry.type]}</i>
      <span>{entry.type}</span>
      <span className="mdl-list__item-text-body">
        {entry.desc}
      </span>
    </span>
    <span className="mdl-list__item-secondary-content">
      {entry.date}
    </span>
  </li>
);

export default Journal;
