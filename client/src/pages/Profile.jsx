import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import homeLogo from '../images/home-icon.png';
import leftArrow from '../images/left-arrow.png';
import rightArrow from '../images/right-arrow.png';

function Profile() {
  const [username, setUsername] = useState('');
  const [previousLineups, setPreviousLineups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  function handleHomePageClick() {
    navigate('/'); // Use the navigate function for navigation
  }
  // Retrieve the token from local storage
const authToken = localStorage.getItem('authToken');
console.log('Token from local storage:', authToken);

  // Fetch the user's username and previous lineups from the server
  useEffect(() => {
    const userId = localStorage.getItem('userId');

    // Set up Axios config with the Authorization header
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include the token here
    },
    
  };

    // Fetch username
    axios.get(`http://localhost:5000/getUsername?userId=${userId}`)
      .then(response => {
        setUsername(response.data.username);
        console.log('Previous Lineups:', response.data);
      })
      .catch(error => {
        console.error('Error fetching username:', error);
        
      });

      // Fetch previous lineups with the Axios config
      axios.get(`http://localhost:5000/getPreviousLineups?userId=${userId}`, axiosConfig)
        .then(response => {
        console.log('Response Data:', response.data); // Check response data
          setPreviousLineups(response.data);
          setCurrentIndex(0);
        })
        .catch(error => {
          console.error('Error fetching previous lineups:', error);
        });
    }, []);

    const prevSlide = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };
  
    const nextSlide = () => {
      if (currentIndex < previousLineups.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };
  

    return (
      <div className="profile-container">
        <ul>
          <li>
            <a href="/" onClick={handleHomePageClick}>
              <img className="home" src={homeLogo} alt="Home" />
            </a>
          </li>
        </ul>
        <h1 className="top-text">{username}'s Profile</h1>
        <h2 className="previous-lineups">Previous Lineups</h2>
        <div className="lineup-slider">
          <button className="slider-button slider-prev-button" onClick={prevSlide}>
          <img src={leftArrow} alt="Previous" />
          </button>
          <div className="lineups-container">
  {previousLineups.map((lineup, index) => (
    <div
      className={`lineup-box ${currentIndex === index ? 'active' : ''}`}
      key={lineup._id}
    >
      <div className="lineup-header">
        <p className="team-name">
          <span className="highlight-orange">Team Name:</span> {lineup.teamName}
        </p>
        <p className="game-date">
          <span className="highlight-orange">Game Date:</span> {lineup.gameDate}
        </p>
      </div>
      <div className="player-list">
        <p className="list-title">Forward Players:</p>
        <ul className="player-ul">
          {lineup.forwardLineup.map((player, playerIndex) => (
            <ul className="player-li" key={playerIndex}>
              <li key={playerIndex}>{player}</li>
            </ul>
          ))}
        </ul>
        <p className="list-title">Defensive Players:</p>
        <ul className="player-ul">
          {lineup.defensiveLineup.map((player, playerIndex) => (
            <ul className="player-li" key={playerIndex}>
              <li key={playerIndex}>{player}</li>
            </ul>
          ))}
        </ul>
      </div>
    </div>
  ))}
</div>


  <button className="slider-button slider-next-button" onClick={nextSlide}>
  <img src={rightArrow} alt="Next" />
</button>
</div>
        </div>
  );
}

export default Profile;
