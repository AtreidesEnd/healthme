import React from "react";
import { Link } from "react-router-dom";

const Header = ({loggedIn}) => (
  <div className="app-header">
    <Link to="/" className="app-logo">HealthMe</Link>
    <nav className="app-header-nav">
      <a href="#" className="app-header-nav-link">Settings</a>
      <a href="#" className="app-header-nav-link">{loggedIn ? "Logout" : "Login"}</a>
    </nav>
  </div>
);

export default Header;
