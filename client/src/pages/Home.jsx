import React from 'react'
import MainLayout from '../layout/MainLayout'
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/team-selection');
  };

  return (
    <div className="home-container">
      <MainLayout>
        <div className="text-container">
          <h1>Ice Hockey Strategy</h1>
          <p>This is some sample text on the left side of the screen.</p>
          <button className="button-container" onClick={handleButtonClick}>
            Get started
          </button>
          <p className="bottom-text">
            "A good hockey player plays where the puck is.<br />A great hockey player plays where the puck is going to be." <br />Wayne Greatzky
          </p>
        </div>
      </MainLayout>
    </div>
  );
}

export default Home;
