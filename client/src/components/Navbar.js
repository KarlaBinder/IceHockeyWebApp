import React from 'react'
import { Link } from "react-router-dom";
import '../styles/Navbar.css';
import logo from '../images/logo.png';

function Navbar() {
  return (
    <div className='navbar'>
      <div className='navbar-logo'>
        <img src={logo} alt="Logo" />
      </div>
      <ul className='navbar-menu'>
        <li><Link to="/">Home</Link></li>
        <li><Link to= "/team-selection">Team selection</Link></li>
        <li><Link to= "/team-pick">Team pick</Link></li>
        <li><Link to= "/user-lineup">User Lineup</Link></li>
        <li><Link to="/product-form">ProductForm</Link></li>
        <li><Link to="/blog">Lineup Strategy</Link></li>
        <li><Link>Data visualisation</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </div>
  )
}

export default Navbar
