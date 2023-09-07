import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link , useNavigate} from 'react-router-dom';
import '../styles/ColoradoAvalanche.css'
import ResultModal from '../components/ResultModal'; // Adjust the path as needed
import homeLogo from '../images/home-icon.png';

function ColoradoAvalanche() {
  const [gameDates, setGameDates] = useState([]);
  const [selectedGameDate, setSelectedGameDate] = useState('');
  const [forwardPlayers, setForwardPlayers] = useState([]);
  const [defensivePlayers, setDefensivePlayers] = useState([]);
  const [selectedForwardPlayers, setSelectedForwardPlayers] = useState(['', '', '']);
  const [selectedDefensivePlayers, setSelectedDefensivePlayers] = useState(['', '']);
  const [lineupMatchup, setLineupMatchup] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultModalContent, setResultModalContent] = useState('');
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

  useEffect(() => {
    fetchGameDates();
  }, []);

  const fetchGameDates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/gamedates', {
        params: {
          teamName: 'Colorado Avalanche'
        }
      });
      const dates = response.data;
      setGameDates(dates);
      if (dates.length > 0) {
        setSelectedGameDate(dates[0]?.date || '');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchForwardPlayers = async (selectedDate) => {
    try {
      const response = await axios.get('http://localhost:5000/forwardplayers', {
        params: {
          gameDate: selectedDate,
          teamName: 'Colorado Avalanche'
        }
      });
      const players = response.data;
      setForwardPlayers(players);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDefensivePlayers = async (selectedDate) => {
    try {
      const response = await axios.get('http://localhost:5000/defensiveplayers', {
        params: {
          gameDate: selectedDate,
          teamName: 'Colorado Avalanche'
        }
      });
      const players = response.data;
      setDefensivePlayers(players);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGameDateChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedGameDate(selectedDate);

    if (selectedDate) {
      fetchForwardPlayers(selectedDate);
      fetchDefensivePlayers(selectedDate);
    } else {
      setForwardPlayers([]);
      setDefensivePlayers([]);
    }
  };

  const handleForwardPlayerChange = (e, index) => {
    const selectedPlayer = e.target.value;
    setSelectedForwardPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];

      // Remove the selected player from other forward dropdowns
      updatedPlayers.forEach((player, i) => {
        if (i !== index && player && player === selectedPlayer) {
          updatedPlayers[i] = '';
        }
      });

      updatedPlayers[index] = selectedPlayer;

      return updatedPlayers;
    });
  };

  const handleDefensivePlayerChange = (e, index) => {
    const selectedPlayer = e.target.value;
    setSelectedDefensivePlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];

      // Remove the selected player from other defensive dropdowns
      updatedPlayers.forEach((player, i) => {
        if (i !== index && player && player === selectedPlayer) {
          updatedPlayers[i] = '';
        }
      });

      updatedPlayers[index] = selectedPlayer;

      return updatedPlayers;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the user ID from local storage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }
    console.log('UserId:',userId);
    const token = localStorage.getItem('authToken');
     const headers = {
     Authorization: `Bearer ${token}`,
};

    const data = {
      teamName: 'Colorado Avalanche',
      gameDate: selectedGameDate,
      forwardLineup: selectedForwardPlayers.filter((player) => player !== '').map((playerId) => forwardPlayers.find((p) => p._id === playerId).playerName),
      defensiveLineup: selectedDefensivePlayers.filter((player) => player !== '').map((playerId) => defensivePlayers.find((p) => p._id === playerId).playerName),
      userId: userId // Include the user's ID in the lineup data
    };

    try {
      await axios.post('http://localhost:5000/saveSelection', data, { headers });
      console.log('Selection saved successfully');
    } catch (error) {
      console.log(error);
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handleCheck = async () => {
    try {
      // Fetch the lineup from the database
      const response = await axios.get('http://localhost:5000/gamelineup', {
        params: {
          gameDate: selectedGameDate,
          teamName: 'Colorado Avalanche',
        },
      });
      const lineup = response.data;
  
      // Convert the selected forward lineup from IDs to names
    const selectedForwardLineup = selectedForwardPlayers
    .filter((playerId) => playerId) // Filter out empty player IDs
    .map((playerId) => {
      const player = forwardPlayers.find((p) => p._id === playerId);
      return player ? player.playerName : ''; // Handle cases where player is not found
    });

  // Convert the selected defensive lineup from IDs to names
  const selectedDefensiveLineup = selectedDefensivePlayers
    .filter((playerId) => playerId) // Filter out empty player IDs
    .map((playerId) => {
      const player = defensivePlayers.find((p) => p._id === playerId);
      return player ? player.playerName : ''; // Handle cases where player is not found
    });

      // Check if the selected lineup matches any type of lineup
      const matchup = checkLineupMatch(lineup, selectedForwardLineup, selectedDefensiveLineup);

     // Inside your handleCheck function
      setResultModalContent(matchup);
      openModal();

  
    } catch (error) {
      console.log(error);
    }
  };
  
  // Function to check if the selected lineup matches any type of lineup
  const checkLineupMatch = (lineup, selectedForwardLineup, selectedDefensiveLineup) => {
    let forwardMatch = false;
    let defensiveMatch = false;
    let forwardMatchType = '';
    let defensiveMatchType = '';
  
    for (const item of lineup) {
      if (item.position === 'forward' && isSameLineup(selectedForwardLineup, item.lineup)) {
        forwardMatch = true;
        forwardMatchType = item.type;
      }
    }
  
    for (const item of lineup) {
      if (item.position === 'defense' && isSameLineup(selectedDefensiveLineup, item.lineup)) {
        defensiveMatch = true;
        defensiveMatchType = item.type;
      }
    }
  
    if (forwardMatch && defensiveMatch) {
      setLineupMatchup(`Forward lineup matches ${forwardMatchType}. Defensive lineup matches ${defensiveMatchType}.`);
    } else if (forwardMatch) {
      setLineupMatchup(`Forward lineup matches ${forwardMatchType}. Defensive lineup doesn't match any lineup.`);
    } else if (defensiveMatch) {
      setLineupMatchup(`Forward lineup doesn't match any lineup. Defensive lineup matches ${defensiveMatchType}.`);
    } else {
      setLineupMatchup('No lineup match found');
    }
  };
  
  
  
  // Function to check if two lineups are the same regardless of the order
  const isSameLineup = (lineup1, lineup2) => {
    const lineup1Set = new Set(lineup1);
    const lineup2Set = new Set(lineup2);
  
    if (lineup1Set.size !== lineup2Set.size) {
      return false;
    }
  
    for (const player of lineup1Set) {
      if (!lineup2Set.has(player)) {
        return false;
      }
    }
  
    return true;
  };


  return (
    <div className="background-container">
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
      <h2>Game Lineup</h2>
      <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="gameDate">Select Game Date:</label>
          <select id="gameDate" value={selectedGameDate} onChange={handleGameDateChange}>
            <option value="" hidden>
              ---
            </option>
              {gameDates.map((date) => (
            <option key={date._id} value={date.date}>
              {date.gameDate}
            </option>
            ))}
          </select>
      </div>
        {selectedGameDate && (
          <div className="lineup-section">
            <h3>Forward Lineup</h3>
            {selectedForwardPlayers.map((selectedPlayer, index) => (
              <div key={index}>
                <label htmlFor={`forwardPlayer${index}`}>Select Forward Player {index + 1}:</label>
                <select
                  id={`forwardPlayer${index}`}
                  value={selectedPlayer}
                  onChange={(e) => handleForwardPlayerChange(e, index)}
                >
                  <option value="">---</option>
                  {forwardPlayers.map((player) => (
                    <option key={player._id} value={player._id}>
                      {player.playerName}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        {selectedGameDate && (
          <div className="lineup-section">
            <h3>Defensive Lineup</h3>
            {selectedDefensivePlayers.map((selectedPlayer, index) => (
              <div key={index}>
                <label htmlFor={`defensivePlayer${index}`}>Select Defensive Player {index + 1}:</label>
                <select
                  id={`defensivePlayer${index}`}
                  value={selectedPlayer}
                  onChange={(e) => handleDefensivePlayerChange(e, index)}
                >
                  <option value="">---</option>
                  {defensivePlayers.map((player) => (
                    <option key={player._id} value={player._id}>
                      {player.playerName}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        <div className="buttons">
         <button type="submit">Save Selection</button>
         <button type="button" onClick={handleCheck}>Check</button>
         <ResultModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            matchup={lineupMatchup}
          />
        </div> 
       <div>
    </div>
      </form>
      <footer className="team-footer">
          <div className="teamfooter-content">
            <p>&copy; 2023 FERIT All rights reserved.</p>
          </div>
        </footer>
    </div>
    </div>
  );
}

export default ColoradoAvalanche;
























