import React, { Component } from 'react';
import Header from './header.jsx';
import Sidenav from './sidenav.jsx';

export default class App extends Component {
  render() {
    const defaultNavs = [{label: 'Journal', icon:'create', link:'/journal'},
                   {label: 'Trends', icon:'show_chart', link:'/trends'},
                   {label: 'History', icon:'restore', link:'/history'}];
    return (
      <div className='app-container'>
        <Header loggedIn={true} />
        <div className='app-main-container'>
          <Sidenav navs={defaultNavs} />
        </div>
      </div>
    );
  }
}
