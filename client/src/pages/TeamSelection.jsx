// TeamSelection.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TeamSelection.css';
import carolinaHurricanesImage from '../images/carolina_huriccanes.png';
import bostonBruinsImage from '../images/boston_bruins.png';
import goldenKnightsImage from '../images/golden_knights.png';
import coloradoAvalancheImage from '../images/colorado_avalanche.png';
import MainLayout from '../layout/MainLayout';


const TeamSelection = () => {  
  return (
    <div className="container">
    <MainLayout> 
      <h1>Select a Team:</h1>
      <div className="picture-container">
        <Link to="/carolina-hurricanes">
          <img src={carolinaHurricanesImage} alt="Carolina Hurricanes"/>
        </Link>
        <Link to="/boston-bruins">
          <img src={bostonBruinsImage} alt="Boston Bruins"/>
        </Link>
        <Link to="/golden-knights">
          <img src={goldenKnightsImage} alt="Golden Knights"/>
        </Link>
        <Link to="/colorado-avalanche">
          <img src={coloradoAvalancheImage} alt="Colorado Avalanche"/>   
        </Link>
      </div>
    </MainLayout>
  </div>
  
  );
};

export default TeamSelection;
