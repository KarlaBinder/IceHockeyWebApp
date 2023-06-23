import './App.css';
import{
  BrowserRouter as Router,
  Routes,
  Route,
}from 'react-router-dom';
import Home from './pages/Home';
import BlogPage from './pages/BlogPage';
import Contact from './pages/Contact';
import TeamPage from './pages/TeamPage';
import ProducForm from './pages/ProducForm';
import UserLineupInput from './pages/UserLineupInput';
import TeamSelection from './pages/TeamSelection';
import CarolinaHurricanes from './pages/CarolinaHurricanes';
import ColoradoAvalanche from './pages/ColoradoAvalanche'
import BostonBruins from './pages/BostonBruins';
import GoldenKnights from './pages/GoldenKnights';

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/team-selection" element={<TeamSelection />} />
        <Route path="/carolina-hurricanes" element={<CarolinaHurricanes />} />
        <Route path="/boston-bruins" element={<BostonBruins/>} />
        <Route path="/golden-knights" element={<GoldenKnights/>} />
        <Route path="/colorado-avalanche" element={<ColoradoAvalanche />} />
        <Route path="/user-lineup" element={<UserLineupInput/>}/>
        <Route path="/team-pick" element={<TeamPage/>}/>
        <Route path="/product-form" element={<ProducForm/>}/>
        <Route path="/blog" element={<BlogPage/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
    </Router>
  );
}

export default App;
