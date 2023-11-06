import React from 'react';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
        <a href="/" className="navbar-brand">ScrumMate</a>
      <div className="navbar-links">
        <a href="/">Release Plan</a>
        <a href="/about">Sprints</a>
      </div>
      <button className="navbar-button">Sign In</button>
    </nav>
  );
};

export default Navbar;
