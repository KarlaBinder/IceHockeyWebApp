import React from 'react'
import MainLayout from '../layout/MainLayout'
import { useState } from 'react';
import '../styles/LineupStrategy.css';

function BlogPage() {
  const [gameDate, setGameDate] = useState('');
  const [forwardPlayers, setForwardPlayers] = useState([]);
  const [defensivePlayers, setDefensivePlayers] = useState([]);

  const handleGameDateChange = (event) => {
    setGameDate(event.target.value);
  };

  const handleForwardPlayerChange = (event, index) => {
    const updatedForwardPlayers = [...forwardPlayers];
    updatedForwardPlayers[index] = event.target.value;
    setForwardPlayers(updatedForwardPlayers);
  };

  const handleDefensivePlayerChange = (event, index) => {
    const updatedDefensivePlayers = [...defensivePlayers];
    updatedDefensivePlayers[index] = event.target.value;
    setDefensivePlayers(updatedDefensivePlayers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any actions with the selected data
    console.log('Game Date:', gameDate);
    console.log('Forward Players:', forwardPlayers);
    console.log('Defensive Players:', defensivePlayers);
  };
  return (
  <div className="paige-container">
    <MainLayout> 
       <div className="game-form-container">
      <h2 className="game-form-title">Game Form</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">
          Game Date:
          <input type="date" value={gameDate} onChange={handleGameDateChange} />
        </label>
        <br />
        <label>
          Forward Players:
          <br />
          <input
            type="text"
            value={forwardPlayers[0] || ''}
            onChange={(event) => handleForwardPlayerChange(event, 0)}
          />
          <br />
          <input
            type="text"
            value={forwardPlayers[1] || ''}
            onChange={(event) => handleForwardPlayerChange(event, 1)}
          />
          <br />
          <input
            type="text"
            value={forwardPlayers[2] || ''}
            onChange={(event) => handleForwardPlayerChange(event, 2)}
          />
        </label>
        <br />
        <label>
          Defensive Players:
          <br />
          <input
            type="text"
            value={defensivePlayers[0] || ''}
            onChange={(event) => handleDefensivePlayerChange(event, 0)}
          />
          <br />
          <input
            type="text"
            value={defensivePlayers[1] || ''}
            onChange={(event) => handleDefensivePlayerChange(event, 1)}
          />
        </label>
        <br />
        <button className="submit-button" type="submit">Submit</button>
      </form>
     </div>
    
    </MainLayout>
   </div>
  )
}

export default BlogPage
