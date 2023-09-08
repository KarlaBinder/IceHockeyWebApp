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
  const [advice, setAdvice] = useState('');
  const [forwardPlayerDetails, setForwardPlayerDetails] = useState([]);
  const [defensivePlayerDetails, setDefensivePlayerDetails] = useState([]);
  const [lineupAnalysis, setlineupAnalysis] = useState('');
  const [mostGoalsPlayer, setMostGoalsPlayer] = useState('');
  const [mostAssistsPlayer, setMostAssistsPlayer] = useState('');
  const [mostPenaltyMinutesPlayer, setmostPenaltyMinutesPlayer] = useState('');
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
  // Assuming you have arrays of selected player IDs for forwards and defense
  const forwardPlayerIds = selectedForwardPlayers.filter((playerId) => playerId !== '');
  const defensivePlayerIds = selectedDefensivePlayers.filter((playerId) => playerId !== '');

  const forwardPlayerDetails = await fetchPlayerDetails(forwardPlayerIds, true);
  const defensivePlayerDetails = await fetchPlayerDetails(defensivePlayerIds, false);


      // Check if the selected lineup matches any type of lineup
      const { lineupMatchup, advice } = checkLineupMatch(lineup, selectedForwardLineup, selectedDefensiveLineup,selectedGameDate);
      // Calculate and display lineup analysis
    const lineupAnalysis = analyzeLineup(
      selectedForwardPlayers,
      selectedDefensivePlayers,
      forwardPlayerDetails,
      defensivePlayerDetails
    );

    const { mostGoalsPlayer, mostAssistsPlayer,mostPenaltyMinutesPlayer } = findMostGoalsAndAssistsPlayers(
      selectedForwardPlayers,
      selectedDefensivePlayers,
      forwardPlayers,
      defensivePlayers
    );
    
    // Combine lineup matchup and additional analysis
const lineupMatchupContent = `${lineupMatchup}`;
const adviceContent = `${advice}`;
const lineupAnalysisContent = `${lineupAnalysis}`;
const mostGoalsContent = `Most Goals Player: ${mostGoalsPlayer}`;
const mostAssistsContent = `Most Assists Player: ${mostAssistsPlayer}`;
const mostPenaltyMinutesContent = `Most Penalty Minutes Player: ${mostPenaltyMinutesPlayer}`;

// Inside your handleCheck function
setResultModalContent({
  lineupMatchupContent,
  adviceContent,
  lineupAnalysisContent,
  mostGoalsContent,
  mostAssistsContent,
  mostPenaltyMinutesContent
});

      openModal();

  
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPlayerDetails = async (playerIds, isForward) => {
    const apiUrl = isForward
      ? 'http://localhost:5000/forwardPlayerDetails'
      : 'http://localhost:5000/defensivePlayerDetails';
  
    try {
      const response = await axios.get(apiUrl, {
        params: {
          playerIds: playerIds,
          gameDate: selectedGameDate, // Pass the selected game date as a parameter
        },
      });
      return response.data; // Return the player details
    } catch (error) {
      console.error(error);
      return []; // Return an empty array in case of an error
    }
  };
  
  const findMostGoalsAndAssistsPlayers = (selectedForwardPlayers, selectedDefensivePlayers, forwardPlayers, defensivePlayers) => {
    let mostGoalsPlayer = null;
    let mostAssistsPlayer = null;
    let mostPenaltyMinutesPlayer = null;
    let mostGoals = 0;
    let mostAssists = 0;
    let mostPenaltyMinutes = 0;
  
    // Calculate most goals, assists, and penalty minutes for forwards
    for (const playerId of selectedForwardPlayers) {
      if (!playerId) continue; // Skip empty selections
      const player = forwardPlayers.find((p) => p._id === playerId);
      if (!player) continue; // Skip if player not found
      if (player.goals > mostGoals) {
        mostGoals = player.goals;
        mostGoalsPlayer = player.playerName;
      }
      if (player.assists > mostAssists) {
        mostAssists = player.assists;
        mostAssistsPlayer = player.playerName;
      }
      if (player.PIM > mostPenaltyMinutes) {
        mostPenaltyMinutes = player.PIM;
        mostPenaltyMinutesPlayer = player.playerName;
      }
    }
  
    // Calculate most goals, assists, and penalty minutes for defensive players
    for (const playerId of selectedDefensivePlayers) {
      if (!playerId) continue; // Skip empty selections
      const player = defensivePlayers.find((p) => p._id === playerId);
      if (!player) continue; // Skip if player not found
      if (player.goals > mostGoals) {
        mostGoals = player.goals;
        mostGoalsPlayer = player.playerName;
      }
      if (player.assists > mostAssists) {
        mostAssists = player.assists;
        mostAssistsPlayer = player.playerName;
      }
      if (player.PIM > mostPenaltyMinutes) {
        mostPenaltyMinutes = player.PIM;
        mostPenaltyMinutesPlayer = player.playerName;
      }
    }
    // Set the state for mostGoalsPlayer, mostAssistsPlayer, and mostPenaltyMinutesPlayer within this function
  setMostGoalsPlayer(mostGoalsPlayer);
  setMostAssistsPlayer(mostAssistsPlayer);
  setmostPenaltyMinutesPlayer(mostPenaltyMinutesPlayer);
  
    return {
      mostGoalsPlayer,
      mostAssistsPlayer,
      mostPenaltyMinutesPlayer,
    };
  };

// Function to analyze the lineup and player statistics
const analyzeLineup = (selectedForwardPlayers, selectedDefensivePlayers, forwardPlayerDetails, defensivePlayerDetails) => {
  // Calculate total goals, assists, and penalty minutes for selected players
  const forwardGoals = forwardPlayerDetails.reduce((total, player) => total + player.goals, 0);
  const forwardAssists = forwardPlayerDetails.reduce((total, player) => total + player.assists, 0);
  const forwardPIM = forwardPlayerDetails.reduce((total, player) => total + player.PIM, 0);

  const defensiveGoals = defensivePlayerDetails.reduce((total, player) => total + player.goals, 0);
  const defensiveAssists = defensivePlayerDetails.reduce((total, player) => total + player.assists, 0);
  const defensivePIM = defensivePlayerDetails.reduce((total, player) => total + player.PIM, 0);

  let lineupAnalysis = '';

  // Include information about goals, assists, and penalty minutes
  lineupAnalysis += `Forward lineup: ${forwardGoals} goals, ${forwardAssists} assists, ${forwardPIM} penalty minutes\n`;
  lineupAnalysis += `Defensive lineup: ${defensiveGoals} goals, ${defensiveAssists} assists, ${defensivePIM} penalty minutes\n`;

  // Additional Analysis
  if (forwardPlayerDetails.length > 0 || defensivePlayerDetails.length > 0) {
    // Include additional analysis only when there is some content
    lineupAnalysis += 'Additional Analysis: ';

    if (forwardPlayerDetails.length > 0) {
      lineupAnalysis += `Forward players found: ${forwardPlayerDetails.length}`;
    }

    if (defensivePlayerDetails.length > 0) {
      if (forwardPlayerDetails.length > 0) {
        lineupAnalysis += ', ';
      }
      lineupAnalysis += `Defensive players found: ${defensivePlayerDetails.length}`;
    }

    lineupAnalysis += '\n';
  }
  setlineupAnalysis(lineupAnalysis);

  return lineupAnalysis;
};

const getBestForwardPlayers = (lineup) => {
  const bestForwardLineup = lineup.find((item) => item.position === 'forward' && item.type === 'best lineup');
  return bestForwardLineup ? bestForwardLineup.lineup : [];
};

const getGoodForwardPlayers = (lineup) => {
  const goodForwardLineup = lineup.find((item) => item.position === 'forward' && item.type === 'good lineup');
  return goodForwardLineup ? goodForwardLineup.lineup : [];
};

const getWorstForwardPlayers = (lineup) => {
  const worstForwardLineup = lineup.find((item) => item.position === 'forward' && item.type === 'worst lineup');
  return worstForwardLineup ? worstForwardLineup.lineup : [];
};
const getBestDefensivePlayers = (lineup) => {
  const bestDefensiveLineup = lineup.find((item) => item.position === 'defense' && item.type === 'best lineup');
  return bestDefensiveLineup ? bestDefensiveLineup.lineup : [];
};

const getGoodDefensivePlayers = (lineup) => {
  const goodDefensiveLineup = lineup.find((item) => item.position === 'defense' && item.type === 'good lineup');
  return goodDefensiveLineup ? goodDefensiveLineup.lineup : [];
};

const getWorstDefensivePlayers = (lineup) => {
  const worstDefensiveLineup = lineup.find((item) => item.position === 'defense' && item.type === 'worst lineup');
  return worstDefensiveLineup ? worstDefensiveLineup.lineup : [];
};

const normalize = (player) => player.replace(/\s/g, '').toLowerCase();

const displayOriginalName = (normalizedName, originalNamesArray) => {
  // Find the original name in the array and return it
  const originalName = originalNamesArray.find((name) => normalize(name) === normalizedName);
  return originalName || normalizedName; // Return the original name if found, or the normalized name if not found
};


const checkLineupMatch = (lineup, selectedForwardLineup, selectedDefensiveLineup) => {
  let forwardMatch = false;
  let defensiveMatch = false;
  let forwardMatchType = '';
  let defensiveMatchType = '';
  let advice = ''; // Initialize advice here

  for (const item of lineup) {
    console.log('Checking Forward Lineup:', item);
    if (item.position === 'forward' && isSameLineup(selectedForwardLineup, item.lineup)) {
      forwardMatch = true;
      forwardMatchType = item.type;
    }
    
  }

  const bestForwardPlayers = getBestForwardPlayers(lineup);
  const goodForwardPlayers = getGoodForwardPlayers(lineup);
  const worstForwardPlayers = getWorstForwardPlayers(lineup);
  const isBestLineup = isSameLineup(selectedForwardLineup, bestForwardPlayers);
  const isGoodLineup = isSameLineup(selectedForwardLineup, goodForwardPlayers);
  const isWorstLineup = isSameLineup(selectedForwardLineup, worstForwardPlayers);
  const normalizedSelectedForwardLineup = selectedForwardLineup.map((player) => normalize(player));
  const bestForwardPlayersNormalized = bestForwardPlayers.map((player) => normalize(player));
  const goodForwardPlayersNormalized = goodForwardPlayers.map((player) => normalize(player));
  const worstForwardPlayersNormalized = worstForwardPlayers.map((player) => normalize(player));
  let missingBestPlayers;
  let missingGoodPlayers;
  let missingWorstPlayers;

  if (!isGoodLineup && !isBestLineup && !isWorstLineup) {
     missingBestPlayers =  bestForwardPlayersNormalized.filter((player) => !normalizedSelectedForwardLineup.includes(player));
     missingGoodPlayers = goodForwardPlayersNormalized.filter((player) => !normalizedSelectedForwardLineup.includes(player));
     missingWorstPlayers = worstForwardPlayersNormalized.filter((player) => !normalizedSelectedForwardLineup.includes(player));
     if (missingBestPlayers.length === 2) {
      advice += `You have one player from the best forward lineup. Consider adding: ${missingBestPlayers.map(player => displayOriginalName(player, bestForwardPlayers)).join(', ')}. `;
    } else if (missingBestPlayers.length === 1) {
      advice += `You have two players from the best forward lineup. Consider adding: ${missingBestPlayers.map(player => displayOriginalName(player, bestForwardPlayers)).join(', ')}.  `;
    } else if (missingGoodPlayers.length === 2) {
      advice += `You have one player from the good forward lineup. Consider adding: ${missingGoodPlayers.map(player => displayOriginalName(player, goodForwardPlayers)).join(', ')}. `;
    } else if (missingGoodPlayers.length === 1) {
      advice += `You have two players from the good forward lineup. Consider adding: ${missingGoodPlayers.map(player => displayOriginalName(player, goodForwardPlayers)).join(', ')}. `;
    } else if (missingWorstPlayers.length > 0) {
      advice += `You also have players from the worst forward lineup. Consider choosing from the best lineup: ${bestForwardPlayers.join(', ')}. `;
    }
  }
  if (isWorstLineup) {
    advice += `You have players from the worst forward lineup. Consider choosing from the best lineup: ${bestForwardPlayers.join(', ')}.  `;
  }
  
  
  for (const item of lineup) {
    console.log('Checking Defensive Lineup:', item);
    if (item.position === 'defense' && isSameLineup(selectedDefensiveLineup, item.lineup)) {
      defensiveMatch = true;
      defensiveMatchType = item.type;
    }
  }

  const bestDefensivePlayers = getBestDefensivePlayers(lineup); // Implement a function to get best defensive players
const goodDefensivePlayers = getGoodDefensivePlayers(lineup); // Implement a function to get good defensive players
const worstDefensivePlayers = getWorstDefensivePlayers(lineup); // Implement a function to get worst defensive players
const isBestDefensiveLineup = isSameLineup(selectedDefensiveLineup, bestDefensivePlayers);
const isGoodDefensiveLineup = isSameLineup(selectedDefensiveLineup, goodDefensivePlayers);
const isWorstDefensiveLineup = isSameLineup(selectedDefensiveLineup, worstDefensivePlayers);
const normalizedSelectedDefensiveLineup = selectedDefensiveLineup.map((player) => normalize(player));
const bestDefensivePlayersNormalized = bestDefensivePlayers.map((player) => normalize(player));
const goodDefensivePlayersNormalized = goodDefensivePlayers.map((player) => normalize(player));
const worstDefensivePlayersNormalized = worstDefensivePlayers.map((player) => normalize(player));

let missingBestDefensivePlayers;
  let missingGoodDefensivePlayers;
  let missingWorstDefensivePlayers;
if (!isGoodDefensiveLineup && !isBestDefensiveLineup && !isWorstDefensiveLineup) {
  missingBestDefensivePlayers = bestDefensivePlayersNormalized.filter((player) => !normalizedSelectedDefensiveLineup.includes(player));
  missingGoodDefensivePlayers = goodDefensivePlayersNormalized.filter((player) => !normalizedSelectedDefensiveLineup.includes(player));
  missingWorstDefensivePlayers = worstDefensivePlayersNormalized.filter((player) => !normalizedSelectedDefensiveLineup.includes(player));

  if (missingBestDefensivePlayers.length === 1) {
    advice += `You have one player from the best defensive lineup. Consider adding: ${missingBestDefensivePlayers.map(player => displayOriginalName(player, bestDefensivePlayers)).join(', ')}. `;
  } else if (missingGoodDefensivePlayers.length === 1) {
    advice += `You have one player from the good defensive lineup. Consider adding: ${missingGoodDefensivePlayers.map(player => displayOriginalName(player, goodDefensivePlayers)).join(', ')}. `;
  } else if (missingWorstDefensivePlayers.length > 0) {
    advice += `You also have players from the worst defensive lineup. Consider choosing from the best lineup: ${bestDefensivePlayers.join(', ')}. `;
  }
}

if (isWorstDefensiveLineup) {
  advice += `You have players from the worst defensive lineup. Consider choosing from the best lineup: ${bestDefensivePlayers.join(', ')}. `;
}


  console.log('Forward Match:', forwardMatch);
  console.log('Forward Match Type:', forwardMatchType);
  console.log('Defensive Match:', defensiveMatch);
  console.log('Defensive Match Type:', defensiveMatchType);

  if (forwardMatch && defensiveMatch) {
    setLineupMatchup(`Forward lineup matches ${forwardMatchType}. Defensive lineup matches ${defensiveMatchType}.`);
  } else if (forwardMatch) {
    setLineupMatchup(`Forward lineup matches ${forwardMatchType}. Defensive lineup doesn't match any lineup.`);
  } else if (defensiveMatch) {
    setLineupMatchup(`Forward lineup doesn't match any lineup. Defensive lineup matches ${defensiveMatchType}.`);
  } else {
    setLineupMatchup('');
  }



  // Set the advice state
  setAdvice(advice);
  console.log('Forward Match Type:', forwardMatchType);
  console.log('Advice:', advice);

  // You can return both matchup and advice if needed
  return { lineupMatchup, advice };
};


  
const isSameLineup = (lineup1, lineup2) => {
  console.log('Lineup 1:', lineup1);
  console.log('Lineup 2:', lineup2);

  // Normalize player names by removing spaces and converting to lowercase
  const normalize = (player) => player.replace(/\s/g, '').toLowerCase();

  // Check if both lineups are arrays and have the same length
  if (!Array.isArray(lineup1) || !Array.isArray(lineup2) || lineup1.length !== lineup2.length) {
    console.log('Lineups have different lengths or are not arrays.');
    return false;
  }

  // Check if every element in lineup1 is also present in lineup2 (order doesn't matter)
  for (const player of lineup1) {
    const normalizedPlayer = normalize(player);
    if (!lineup2.some((player2) => normalize(player2) === normalizedPlayer)) {
      console.log(`Player "${player}" is not in lineup2.`);
      return false;
    }
  }

  // Check if every element in lineup2 is also present in lineup1 (order doesn't matter)
  for (const player of lineup2) {
    const normalizedPlayer = normalize(player);
    if (!lineup1.some((player1) => normalize(player1) === normalizedPlayer)) {
      console.log(`Player "${player}" is not in lineup1.`);
      return false;
    }
  }

  // If all checks pass, the lineups are considered the same
  console.log('Lineups are the same.');
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
            lineupMatchup={lineupMatchup}
            advice={advice} 
            lineupAnalysis={lineupAnalysis}
            mostGoalsPlayer={mostGoalsPlayer}
            mostAssistsPlayer={mostAssistsPlayer}
            mostPenaltyMinutesPlayer={mostPenaltyMinutesPlayer}
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
























