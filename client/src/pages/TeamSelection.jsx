// TeamSelection.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TeamSelection.css';
import carolinaHurricanesImage from '../images/carolina_hurricanes.png';
import bostonBruinsImage from '../images/boston_bruins.png';
import goldenKnightsImage from '../images/vegas_knights.png';
import coloradoAvalancheImage from '../images/colorado_avalanche.png';
import homeLogo from '../images/home-icon.png';

function handleHomePageClick(event) {
  event.preventDefault(); // Prevent the default behavior of following the link
  window.location.href = "/"; // Navigate to the homepage by changing the URL
}


const TeamSelection = () => {  
  return (
    <div className="container">
      <div className='team-navbar'>
        <ul className='team-navmenu'>
              <li>
              <a href="/" onClick={handleHomePageClick}>
                <img className="home-logo" src={homeLogo} alt="Home" />
              </a>
              <div className="profile-dropdown logo-and-dropdown">
                <button className="profile-dropbtn">Profile</button>
                <div className="profile-dropdown-content">
                  <Link to="/profile">View Profile</Link>
                  <button className='logout' >Logout</button>
                </div>
              </div>
            </li>
          </ul>
       </div>
      <h1 className="title-container">Select the Team</h1>
      <div className="picture-container">
        <div className="picture-box">
          <Link to="/carolina-hurricanes">
            <img src={carolinaHurricanesImage} alt="Carolina Hurricanes"/>
          </Link>
        </div>
        <div className="picture-box">
          <Link to="/boston-bruins">
            <img src={bostonBruinsImage} alt="Boston Bruins"/>
           </Link>
        </div>
        <div className="picture-box">
          <Link to="/golden-knights">
             <img src={goldenKnightsImage} alt="Golden Knights"/>
          </Link>
        </div>
        <div className="picture-box">
          <Link to="/colorado-avalanche">
            <img src={coloradoAvalancheImage} alt="Colorado Avalanche"/>   
          </Link>
        </div>
      </div>
      <footer className="team-footer">
          <div className="teamfooter-content">
            <p>&copy; 2023 FERIT All rights reserved.</p>
          </div>
        </footer>
  </div>
  );
};

export default TeamSelection;
