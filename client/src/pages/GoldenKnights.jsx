import React, { useState } from 'react';
import '../styles/UserLineupInput.css';

function GoldenKnights() {
  const teamName='Golden Knights';
  const [gameDate, setGameDate] = useState('');
  const [forwardLineup, setForwardLineup] = useState(['', '', '']);
  const [defensiveLineup, setDefensiveLineup] = useState(['', '']);
  const [message, setMessage] = useState('');

  const handleForwardPlayerChange = (index, value) => {
    const updatedLineup = [...forwardLineup];
    updatedLineup[index] = value;
    setForwardLineup(updatedLineup);
  };

  const handleDefensivePlayerChange = (index, value) => {
    const updatedLineup = [...defensiveLineup];
    updatedLineup[index] = value;
    setDefensiveLineup(updatedLineup);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit the lineup data to the server or perform any other actions
    const newUserSelection = {
        teamName,
        gameDate,
        forwardLineup: [
          { name: forwardLineup[0] },
          { name: forwardLineup[1] },
          { name: forwardLineup[2] }
        ],
        defensiveLineup: [
          { name: defensiveLineup[0] },
          { name: defensiveLineup[1] }
        ]
    };
  
    fetch('http://localhost:5000/user-selection-ch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUserSelection),
    })
      .then((response) => {
        console.log(response); // Log the response object
        if (response.ok) {
          setMessage('Data saved successfully');
        } else {
          setMessage('Failed to save data');
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage('Error occurred while saving data');
      });
  };
  

  return (
    <div className="container">
      <h1>Carolina Hurricanes</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <h2>Forward Lineup</h2>
            <div className="form-group">
              <label>Player 1</label>
              <select
                className="form-control"
                value={forwardLineup[0]}
                onChange={(e) => handleForwardPlayerChange(0, e.target.value)}
              >
                <option value="">Select Player</option>
                <option value="Nathan MacKinnon">Nathan MacKinnon</option>
                <option value="Gabriel Landeskog">Gabriel Landeskog</option>
                <option value="Mikko Rantanen">Mikko Rantanen</option>
                {/* Add options for forward players */}
              </select>
            </div>
            <div className="form-group">
              <label>Player 2</label>
              <select
                className="form-control"
                value={forwardLineup[1]}
                onChange={(e) => handleForwardPlayerChange(1, e.target.value)}
              >
                <option value="">Select Player</option>
                <option value="Nathan MacKinnon">Nathan MacKinnon</option>
                <option value="Gabriel Landeskog">Gabriel Landeskog</option>
                <option value="Mikko Rantanen">Mikko Rantanen</option>
                {/* Add options for forward players */}
              </select>
            </div>
            <div className="form-group">
              <label>Player 3</label>
              <select
                className="form-control"
                value={forwardLineup[2]}
                onChange={(e) => handleForwardPlayerChange(2, e.target.value)}
              >
                <option value="">Select Player</option>
                <option value="Nathan MacKinnon">Nathan MacKinnon</option>
                <option value="Gabriel Landeskog">Gabriel Landeskog</option>
                <option value="Mikko Rantanen">Mikko Rantanen</option>
                {/* Add options for forward players */}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <h2>Defensive Lineup</h2>
            <div className="form-group">
              <label>Player 1</label>
              <select
                className="form-control"
                value={defensiveLineup[0]}
                onChange={(e) => handleDefensivePlayerChange(0, e.target.value)}
              >
                <option value="">Select Player</option>
                <option value="Nathan MacKinnon">Nathan MacKinnon</option>
                <option value="Gabriel Landeskog">Gabriel Landeskog</option>
                <option value="Mikko Rantanen">Mikko Rantanen</option>
                {/* Add options for defensive players */}
              </select>
            </div>
            <div className="form-group">
              <label>Player 2</label>
              <select
                className="form-control"
                value={defensiveLineup[1]}
                onChange={(e) => handleDefensivePlayerChange(1, e.target.value)}
              >
                <option value="">Select Player</option>
                <option value="Nathan MacKinnon">Nathan MacKinnon</option>
                <option value="Gabriel Landeskog">Gabriel Landeskog</option>
                <option value="Mikko Rantanen">Mikko Rantanen</option>
                {/* Add options for defensive players */}
              </select>
            </div>
          </div>
        </div>
        <input
        type="date"
        value={gameDate}
        onChange={(e) => setGameDate(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GoldenKnights;