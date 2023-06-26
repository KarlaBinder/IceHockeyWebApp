import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ColoradoAvalanche.css'
import MainLayout from '../layout/MainLayout'

function ColoradoAvalanche() {
  const [gameDates, setGameDates] = useState([]);
  const [selectedGameDate, setSelectedGameDate] = useState('');
  const [forwardPlayers, setForwardPlayers] = useState([]);
  const [defensivePlayers, setDefensivePlayers] = useState([]);
  const [selectedForwardPlayers, setSelectedForwardPlayers] = useState(['', '', '']);
  const [selectedDefensivePlayers, setSelectedDefensivePlayers] = useState(['', '']);
  const [lineupMatchup, setLineupMatchup] = useState('');

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
          gameDate: selectedDate
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
          gameDate: selectedDate
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

    const data = {
      teamName: 'Colorado Avalanche',
      gameDate: selectedGameDate,
      forwardLineup: selectedForwardPlayers.filter((player) => player !== '').map((playerId) => forwardPlayers.find((p) => p._id === playerId).playerName),
      defensiveLineup: selectedDefensivePlayers.filter((player) => player !== '').map((playerId) => defensivePlayers.find((p) => p._id === playerId).playerName)
    };

    try {
      await axios.post('http://localhost:5000/saveSelection', data);
      console.log('Selection saved successfully');
    } catch (error) {
      console.log(error);
    }
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
      const selectedForwardLineup = selectedForwardPlayers.map((playerId) =>
        forwardPlayers.find((p) => p._id === playerId).playerName
      );
  
      // Convert the selected defensive lineup from IDs to names
  
     const selectedDefensiveLineup=selectedDefensivePlayers.map((playerId)=>
     defensivePlayers.find((p)=>p._id===playerId).playerName);
      // Check if the selected lineup matches any type of lineup
      const matchup = checkLineupMatch(lineup, selectedForwardLineup, selectedDefensiveLineup);
  
      // Display the results
      console.log('Selected Forward Lineup:', selectedForwardLineup);
      console.log('Selected Defensive Lineup:', selectedDefensiveLineup);
      console.log('Lineup Matchup:', matchup);
  
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
      <MainLayout>
      <h2>Game Lineup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="gameDate">Select Game Date:</label>
          <select id="gameDate" value={selectedGameDate} onChange={handleGameDateChange}>
            <option value="">Select Date</option>
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
                  <option value="">Select Player</option>
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
                  <option value="">Select Player</option>
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
        </div> 
       <div>
        {lineupMatchup && <p>{lineupMatchup}</p>}

    </div>
      </form>
      </MainLayout>
    </div>
    </div>
  );
}

export default ColoradoAvalanche;
























