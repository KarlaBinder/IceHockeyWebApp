import React from 'react'
import { Link } from "react-router-dom";
import '../styles/Navbar.css';

function Navbar() {
  return (
    <div className='navbar'>
      <ul className='navbar-menu'>
        <li><Link to="/">Home</Link></li>
        <li><Link to= "/team-selection">Team selection</Link></li>
        <li><Link>About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </div>
  )
}

export default Navbar
