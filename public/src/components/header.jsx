import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({loggedIn, history, onLogout}) => (
  <div className="app-header">
    <Link to="/" className="app-logo">HealthMe</Link>
    <nav className="app-header-nav">
      {(loggedIn) ? (<a href="#" className="app-header-nav-link">Settings</a>) : null}
      {(loggedIn) ? (<a href="#" onClick={(e) => {
        onLogout(e);
        history.push({pathname: '/login'});
      }} className="app-header-nav-link">{'Logout'}</a>) : null}
    </nav>
  </div>
);

export default Header;
