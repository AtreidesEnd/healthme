import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Rating from 'react-rating';
import NumberPicker from 'react-widgets/lib/NumberPicker';
import simpleNumberLocalizer from 'react-widgets-simple-number';
simpleNumberLocalizer();
moment.locale('en');
momentLocalizer(moment);

export default class NewDaily extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: new Date(), title: '', desc: '',
      overall: 0, physicals: [], emotionals: [], ills: []
    };
  }

  componentDidMount() {
    window.componentHandler.upgradeElements(findDOMNode(this));
  }
  componentWillUnmount() {
    const element = findDOMNode(this);
    window.componentHandler.downgradeElements(element);
  }

  render() {
    return (
      <div className="new-entry-form-div shadow">
        <div className="new-entry-header"><span>New Daily</span></div>
        <form onSubmit={this.onSubmit}>
          <div className="inline-form">
            <TextFieldInput id="title" name="title" label="Title" value={this.state.title} onChange={e => this.setState({ title: e.target.value})} />
            <DateTimePicker className="new-entry-datetime" name="datetime" value={this.state.datetime} onChange={datetime => this.setState({ datetime })}/>
          </div>
          <TextAreaInput id="desc" name="desc" label="Daily Log" value={this.state.desc} onChange={e => this.setState({ desc: e.target.value})} />
          <RatingInput value={this.state.overall} id="overall-rating" name="overall-rating"
            label="Overall Feeling:" onChange={overall => this.setState({overall})} />
          <div className="inline-form">
            <div className="inline-form-group">
              <div className="inline-form-label">Sleep (hrs):</div>
              <NumberPicker name="sleep" className="new-entry-form-numpick"
                step={1} min={0} onChange={sleep => this.setState({sleep})}
                format="####"
              />
            </div>
            <div className="inline-form-group">
              <div className="inline-form-label">Water (L):</div>
              <NumberPicker name="water" className="new-entry-form-numpick"
                step={1} min={0} onChange={water => this.setState({water})}
                format="####"
              />
            </div>
            <div className="inline-form-group">
              <div className="inline-form-label">Movement (min):</div>
              <NumberPicker name="movement" className="new-entry-form-numpick"
                step={15} min={0} onChange={movement => this.setState({movement})}
                format="####"
              />
            </div>
          </div>
          <div className="new-entry-form-submit-div">
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Cancel</button>
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

const RatingInput = ({value, onChange, id, name, label}) => {
  return (
    <div className='inline-form'>
      <div className="inline-form-label">{label}</div>
      <Rating className="new-entry-form-rating" id={id} name={name} onChange={onChange}
        initialRate={value} start={0} stop={5} />
    </div>
  );
};

const TextFieldInput = ({value, onChange, id, name, label}) => {
  return (
    <div className="new-entry-form-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <label htmlFor={id} className="new-entry-text-label mdl-textfield__label">{label}</label>
      <input id={id} name={name} className="new-entry-text-input mdl-textfield__input"
        type="text" value={value}
        onChange={onChange}
      />
    </div>
  );
};

const TextAreaInput = ({value, onChange, id, name, label}) => {
  return (
    <div className="new-entry-form-textarea mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <label htmlFor={id} className="new-entry-text-label mdl-textfield__label">{label}</label>
      <textarea id={id} name={name} className="new-entry-text-input mdl-textfield__input"
        type="text" rows="2" value={value} onChange={onChange}>
      </textarea>
    </div>
  );
};
