import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/TeamSelection.css";
import carolinaHurricanesImage from "../images/carolina_hurricanes.png";
import bostonBruinsImage from "../images/boston_bruins.png";
import goldenKnightsImage from "../images/vegas_knights.png";
import coloradoAvalancheImage from "../images/colorado_avalanche.png";
import homeLogo from "../images/home-icon.png";

function TeamSelection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileUsername, setProfileUsername] = useState("");
  const navigate = useNavigate();

  function handleHomePageClick() {
    navigate("/");
  }
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:5000/getUsername?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setProfileUsername(data.username);
      })
      .catch((error) => {
        console.error("Error fetching username:", error);
      });
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="container">
      <div className="team-navbar">
        <div className="navbar-left">
          <ul className="team-navmenu">
            <li>
              <a href="/" onClick={handleHomePageClick}>
                <img className="home-logo" src={homeLogo} alt="Home" />
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          <div className="dropdown">
            <button className="profile-dropbtn">{`${profileUsername}`}</button>
            <div className="profile-dropdown-content">
              <Link to="/profile" className="drop-con">
                View Profile
              </Link>
              <button className="drop-con" onClick={handleLogoutClick}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <h1 className="title-container">Select the Team</h1>
      <div className="picture-container">
        <div className="picture-box">
          <Link to="/carolina-hurricanes">
            <img
              src={carolinaHurricanesImage}
              alt="Carolina Hurricanes"
              title="Carolina Hurricanes"
            />
          </Link>
        </div>
        <div className="picture-box">
          <Link to="/boston-bruins">
            <img
              src={bostonBruinsImage}
              alt="Boston Bruins"
              title="Boston Bruins"
            />
          </Link>
        </div>
        <div className="picture-box">
          <Link to="/golden-knights">
            <img
              src={goldenKnightsImage}
              alt="Golden Knights"
              title="Vegas Golden Knights"
            />
          </Link>
        </div>
        <div className="picture-box">
          <Link to="/colorado-avalanche">
            <img
              src={coloradoAvalancheImage}
              alt="Colorado Avalanche"
              title="Colorado Avalanche"
            />
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
}

export default TeamSelection;
