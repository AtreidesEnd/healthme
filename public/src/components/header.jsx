import React from 'react';

const Header = ({loggedIn}) => (
  <div className='app-header'>
    <div className='app-logo'>HealthMe</div>
    <nav className='app-header-nav'>
      <a href='#' className='app-header-nav-link'>Settings</a>
      <a href='#' className='app-header-nav-link'>{loggedIn ? 'Logout' : 'Login'}</a>
    </nav>
  </div>
);

export default Header;
