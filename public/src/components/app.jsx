import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Header from './header.jsx';
import Sidenav from './sidenav.jsx';
import Journal from './journal.jsx';
import NewMeal from './forms/new-meal.jsx';
import NewActivity from './forms/new-activity.jsx';
import NewFeeling from './forms/new-feeling.jsx';
import NewDaily from './forms/new-daily.jsx';

const defaultNavs = [{label: 'Journal', icon:'create', link:'/'},
               {label: 'Trends', icon:'show_chart', link:'/trends'},
               {label: 'History', icon:'history', link:'/history'}];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.RootRedirect = () => (<Redirect to="/"/>);
  }

  render() {
    return (
      <Router>
        <div className='app-container'>
          <Header loggedIn={true} />
          <div className='app-main-container'>
            <div className='app-sidebar-container'>
              <Sidenav navs={defaultNavs} />
            </div>
            <div className='app-content-module'>
              <Route exact path="/" render={props => (<Journal />)} />
              <Route path="/new/daily" render={props => (<NewDaily redirect={this.RootRedirect} />)} />
              <Route path="/new/meal" render={props => (<NewMeal redirect={this.RootRedirect} />)} />
              <Route path="/new/activity" render={props => (<NewActivity redirect={this.RootRedirect} />)} />
              <Route path="/new/feeling" render={props => (<NewFeeling redirect={this.RootRedirect} />)} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
