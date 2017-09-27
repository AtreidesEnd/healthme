import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';
import Header from './header.jsx';
import Sidenav from './sidenav.jsx';
import Login from './forms/login.jsx';
import Signup from './forms/signup.jsx';
import Journal from './journal.jsx';
import History from './history.jsx';
import Trends from './trends.jsx';
import NewMeal from './forms/new-meal.jsx';
import NewActivity from './forms/new-activity.jsx';
import NewFeeling from './forms/new-feeling.jsx';
import NewDaily from './forms/new-daily.jsx';

const RoutedHeader = withRouter(Header);

const defaultNavs = [{label: 'Journal', icon: 'create', link: '/'},
  {label: 'Trends', icon: 'show_chart', link: '/trends'},
  {label: 'History', icon: 'history', link: '/history'}];

export default class App extends Component {
  constructor(props) {
    super(props);
    const jwt = window.sessionStorage.getItem('healthme_jwt_token') || '';
    const loggedIn = !!jwt;
    this.state = {
      loggedIn: loggedIn,
      token: jwt,
    };
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  onLoginSuccess(token) {
    this.setState({loggedIn: true, token: token});
    window.sessionStorage.setItem('healthme_jwt_token', token);
  }

  onLogout(e) {
    e && e.preventDefault();
    this.setState({loggedIn: false, token: ''});
    window.sessionStorage.removeItem('healthme_jwt_token');
  }

  getToken() {
    return this.state.token;
  }

  render() {
    return (
      <Router>
        <div className='app-container'>
          <RoutedHeader loggedIn={this.state.loggedIn} onLogout={this.onLogout} />
          <div className='app-main-container'>
            <div className='app-sidebar-container'>
              <Sidenav navs={defaultNavs} />
            </div>
            <div className='app-content-module'>
              <Route path="/login" render={props => (<Login onLogin={this.onLoginSuccess} {...props}/>)} />
              <Route path="/signup" render={props => (<Signup onLogin={this.onLoginSuccess} {...props}/>)} />
              <Route exact path="/" render={props => (this.state.loggedIn) ? (<Journal auth={this.getToken} />) : (<Redirect to='/login' />)} />
              <Route path="/history" render={props => (this.state.loggedIn) ? (<History auth={this.getToken} />) : (<Redirect to='/login' />)} />
              <Route path="/trends" render={props => (this.state.loggedIn) ? (<Trends auth={this.getToken} />) : (<Redirect to='/login' />)} />
              <Route path="/new/daily" render={props => (this.state.loggedIn) ? (<NewDaily auth={this.getToken} {...props}/>) : (<Redirect to='/login' />)} />
              <Route path="/new/meal" render={props => (this.state.loggedIn) ? (<NewMeal auth={this.getToken} {...props}/>) : (<Redirect to='/login' />)} />
              <Route path="/new/activity" render={props => (this.state.loggedIn) ? (<NewActivity auth={this.getToken} {...props}/>) : (<Redirect to='/login' />)} />
              <Route path="/new/feeling" render={props => (this.state.loggedIn) ? (<NewFeeling auth={this.getToken} {...props}/>) : (<Redirect to='/login' />)} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
