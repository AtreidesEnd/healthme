import React from 'react';
import { Link } from 'react-router-dom';

const Sidenav = ({navs}) => (
  <div className='app-sidenav shadow'>
    <div className='app-sidenav-header'>Navigation</div>
    {navs.map((nav, i) => <SidenavItem key={`sidenav-${i}`} label={nav.label} link={nav.link} icon={nav.icon}/>)}
  </div>
);

const SidenavItem = ({label, link, icon}) => (
  <Link to={link} className='app-sidenav-item' href={link}>
    <span className='app-sidenav-item-label'>{label}</span>
    <i className='app-sidenav-item-icon material-icons'>{icon}</i>
  </Link>
);

export default Sidenav;
