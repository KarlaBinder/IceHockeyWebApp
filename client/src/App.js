import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TeamSelection from './pages/TeamSelection';
import CarolinaHurricanes from './pages/CarolinaHurricanes';
import ColoradoAvalanche from './pages/ColoradoAvalanche';
import BostonBruins from './pages/BostonBruins';
import GoldenKnights from './pages/GoldenKnights';


function App() {
  // You can still keep the isAuthenticated state here if needed
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/team-selection" element={<TeamSelection />} />
        <Route path="/carolina-hurricanes" element={<CarolinaHurricanes />} />
        <Route path="/boston-bruins" element={<BostonBruins />} />
        <Route path="/golden-knights" element={<GoldenKnights />} />
        <Route path="/colorado-avalanche" element={<ColoradoAvalanche />} />
      </Routes>
    </Router>
  );
}

export default App;


