import React, { Component } from 'react';
import axios from 'axios';
import { findDOMNode } from 'react-dom';
import { TextFieldInput } from './form-helpers.jsx';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confPassword: '',
      email: '',
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
    if (this.validateForm()) {
      axios.post('/api/users/signup', {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
      }).then(resp => {
        console.log(resp);
      }).catch(err => this.setState({formWarning: 'Server error: ' + err}));
    }
    console.log(this.state);
  }

  validateForm(e) {
    if (this.state.password !== this.state.confPassword) {
      this.setState({formWarning: 'Passwords must match, please try again.'});
      return false;
    } else {
      return true;
    }
  }

  goToLogin(e) {
    e && e.preventDefault();
    console.log('not setup yet!!!');
  }

  render() {
    return (
      <div className="login-container shadow">
        <div className="login-header"><span>Signup</span></div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <TextFieldInput id="username" name="username" label="Username"
            value={this.state.username}
            onChange={e => this.setState({username: e.target.value})} />
          <TextFieldInput id="password" name="password" label="Password"
            value={this.state.password} type="password"
            onChange={e => this.setState({password: e.target.value})} />
          <TextFieldInput id="confPassword" name="confPassword" label="Confirm password"
            value={this.state.confPassword} type="password"
            onChange={e => this.setState({confPassword: e.target.value})} />
          {this.state.formWarning && <div className="form-warning">{this.state.formWarning}</div>}
          <div className="new-entry-form-submit-div">
            <button onClick={(e) => this.goToSignup(e)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Login &rarr;</button>
            <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
