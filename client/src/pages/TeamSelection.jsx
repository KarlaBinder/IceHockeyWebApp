// TeamSelection.js

import React,{ useState} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import '../styles/TeamSelection.css';
import carolinaHurricanesImage from '../images/carolina_hurricanes.png';
import bostonBruinsImage from '../images/boston_bruins.png';
import goldenKnightsImage from '../images/vegas_knights.png';
import coloradoAvalancheImage from '../images/colorado_avalanche.png';
import homeLogo from '../images/home-icon.png';

function TeamSelection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Access the navigate function from useNavigate
  const navigate = useNavigate();

  function handleHomePageClick() {
    navigate('/'); // Use the navigate function for navigation
  }
  const handleLogoutClick = () => {
    // Clear the JWT token from local storage
    localStorage.removeItem('authToken');
  
    // Update the isAuthenticated state or perform any other necessary actions
    setIsAuthenticated(false);
  
    // Optionally, navigate the user to a different page (e.g., home page)
    navigate('/');
  };
    
  return (
    <div className="container">
      <div className='team-navbar'>
        <ul className='team-navmenu'>
              <li>
              <a href="/" onClick={handleHomePageClick}>
                <img className="home-logo" src={homeLogo} alt="Home" />
              </a>
              <div className="dropdown">
                <button className="profile-dropbtn">Profile</button>
                <div className="profile-dropdown-content">
                  <Link to="/profile" className="drop-con">View Profile</Link>
                  <button className='drop-con' onClick={handleLogoutClick}>Logout</button>
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
