
// Create a new file, e.g., ResultModal.js

import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // For accessibility

const ResultModal = ({ isOpen, closeModal,lineupMatchup, lineupAnalysis,mostGoalsPlayer, mostAssistsPlayer,mostPenaltyMinutesPlayer,advice }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="modal">
      <div className="modal-content">
        <h2>Lineup Match Result</h2>
        {lineupMatchup&& <p>Lineup Matchup: {lineupMatchup}</p>}
        {advice &&<p>Advice: {advice}</p>}
      {lineupAnalysis && <p>Additional Analysis: {lineupAnalysis}</p>}
       {mostGoalsPlayer&&<p>Player with the most goals: {mostGoalsPlayer}</p>}
       {mostAssistsPlayer &&<p>Player with the most assists: {mostAssistsPlayer}</p>}
       {mostPenaltyMinutesPlayer &&<p>Player with the most penaly minutes: {mostPenaltyMinutesPlayer}</p>}
        <button onClick={closeModal}>Close</button>
      </div>
    </Modal>
  );
};

export default ResultModal;

