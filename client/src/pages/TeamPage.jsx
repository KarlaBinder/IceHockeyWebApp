import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TeamPage.css';
import MainLayout from '../layout/MainLayout';

const TeamPage = () => {
  return (
    <MainLayout>
    <div className="container team-page">
      <h1 className="text-center">Select Your Favorite Team</h1>
      <div className="team-container">
        <div className="team-box">
          <img src="/path/to/team1.jpg" alt="Team 1" className="team-image" />
          <h2>Team 1</h2>
          <Link to="/team1" className="btn btn-primary">Visit Team 1 Site</Link>
        </div>
        <div className="team-box">
          <img src="/path/to/team2.jpg" alt="Team 2" className="team-image" />
          <h2>Team 2</h2>
          <Link to="/team2" className="btn btn-primary">Visit Team 2 Site</Link>
        </div>
        <div className="team-box">
          <img src="/path/to/team3.jpg" alt="Team 3" className="team-image" />
          <h2>Team 3</h2>
          <Link to="/team3" className="btn btn-primary">Visit Team 3 Site</Link>
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default TeamPage;

