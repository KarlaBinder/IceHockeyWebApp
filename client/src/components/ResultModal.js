
// Create a new file, e.g., ResultModal.js

import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // For accessibility

const ResultModal = ({ isOpen, closeModal,matchup }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="modal">
      <div className="modal-content">
        <h2>Lineup Match Result</h2>
        <p>{matchup}</p> {/* Display the matchup here */}
        <button onClick={closeModal}>Close</button>
      </div>
    </Modal>
  );
};

export default ResultModal;

