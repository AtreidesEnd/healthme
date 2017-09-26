import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Header from './header.jsx';
import Sidenav from './sidenav.jsx';
import Journal from './journal.jsx';
import NewMeal from './forms/new-meal.jsx';
import NewActivity from './forms/new-activity.jsx';
import NewFeeling from './forms/new-feeling.jsx';
import NewDaily from './forms/new-daily.jsx';
// mock data for now
const defaultNavs = [{label: 'Journal', icon:'create', link:'/journal'},
               {label: 'Trends', icon:'show_chart', link:'/trends'},
               {label: 'History', icon:'history', link:'/history'}];
const entries = [{type: 'daily', date:'2017-09-25', time:'18:00:00',
                  desc:'2 Huel shakes and some avocado, feeling mostly good, glad to have gotten a workout in',
                  details: {sleep:7, move:30, water:3}},
                {type: 'feeling', date:'2017-09-24', time:'21:00:00',
                desc:'went out drinking for birthday, tired now and starting to feel hungover',
                details: {phys: 4, emo: 8, ill:0}},
                {type: 'activity', date:'2017-09-25', time:'12:00:00',
                desc:'little bit of rowing just to tire myself out',
                details: {type: 'cardio', int: 5, duration:30 }}];

export default class App extends Component {
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
              <Route exact path="/" render={props => (<Journal entries={entries} />)} />
              <Route path="/new/daily" component={NewDaily} />
              <Route path="/new/meal" component={NewMeal} />
              <Route path="/new/activity" component={NewActivity} />
              <Route path="/new/feeling" component={NewFeeling} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
