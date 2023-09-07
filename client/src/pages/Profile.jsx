import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

function Profile() {
  const [username, setUsername] = useState('');
  const [previousLineups, setPreviousLineups] = useState([]);

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
        })
        .catch(error => {
          console.error('Error fetching previous lineups:', error);
        });
    }, []);

    return (
        <div className="profile-container">
          <h1>{username}'s Profile</h1>
          <h2>Previous Lineups</h2>
          <ul className="lineups-list">
            {previousLineups.map(lineup => (
              <li key={lineup._id}>
                <p>Team Name: {lineup.teamName}</p>
                <p>Game Date: {lineup.gameDate}</p>
                <p>Forward Players:</p>
                    <ul>
                        {lineup.forwardLineup.map((player, index) => (
                            <li key={index}>{player}</li>
                        ))}
                    </ul>
                    <p>Defensive Players:</p>
                    <ul>
                        {lineup.defensiveLineup.map((player, index) => (
                            <li key={index}>{player}</li>
                        ))}
                    </ul>
              </li>
            ))}
          </ul>
        </div>
  );
}

export default Profile;
