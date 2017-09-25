import React from 'react';

const Sidenav = ({navs}) => (
  <div className='app-sidenav shadow'>
    <div className='app-sidenav-header'>Navigation</div>
    {navs.map((nav, i) => <SidenavItem key={`sidenav-${i}`} label={nav.label} link={nav.link} icon={nav.icon}/>)}
  </div>
);

const SidenavItem = ({label, link, icon}) => (
  <a className='app-sidenav-item' href={link}>
    <span className='app-sidenav-item-label'>{label}</span>
    <i className='app-sidenav-item-icon material-icons'>{icon}</i>
  </a>
);

export default Sidenav;
