import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import axios from 'axios';
import { TextFieldInput } from './form-helpers.jsx';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      formWarning: '',
    };
  }

  componentDidMount() {
    window.componentHandler.upgradeElements(findDOMNode(this));
  }

  componentWillUnmount() {
    const element = findDOMNode(this);
    window.componentHandler.downgradeElements(element);
  }

  handleSubmit(e) {
    e && e.preventDefault();
    axios.post('/api/users/login', {
      username: this.state.username,
      password: this.state.password
    }).then(resp => {
      console.log(resp);
    }).catch(err => this.setState({formWarning: 'Server error: ' + err}));
  }

  goToSignup(e) {
    e && e.preventDefault();
    console.log('not setup yet!!!');
  }

  render() {
    return (
      <div className="login-container shadow">
        <div className="login-header"><span>Login</span></div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <TextFieldInput id="username" name="username" label="Username"
            value={this.state.username}
            onChange={e => this.setState({username: e.target.value})} />
          <TextFieldInput id="password" name="password" label="Password"
            value={this.state.password} type="password"
            onChange={e => this.setState({password: e.target.value})} />
          <div className="new-entry-form-submit-div">
            <button onClick={(e) => this.goToSignup(e)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">&larr; Signup</button>
            <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Login</button>
          </div>
        </form>
      </div>
    );
  }
}
