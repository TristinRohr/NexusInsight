import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AboutDonation from './components/AboutDonation';
import './App.css';  // Importing the CSS file
import LoginRegister from './components/LoginRegister';
import Profile from './components/Profile';
import FavoriteFeed from './components/FavoriteFeed';
import NavBar from './components/NavBar';
import LandingSearch from './components/LandingSearch';
import MatchHistoryWrapper from './components/MatchHistoryWrapper';

const App = () => {
  const [summonerName, setSummonerName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isHeader, setIsHeader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const searchHandler = (gameName, tag) => {
    setSummonerName(gameName);
    setTagLine(tag);
    setIsHeader(true);  // Trigger the animation when the search is performed
    navigate(`/match-history/${gameName}/${tag}`);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/graphql', {
        query: `mutation logout { logout }`
      }, { withCredentials: true });

      setIsLoggedIn(false);
      navigate('/');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} handleSearch={searchHandler} isHeader={isHeader} />
        <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/LandingSearch" /> : <LoginRegister />
          }
        />
        <Route
          path="/LandingSearch"
          element={<LandingSearch onSearch={searchHandler}/>}
        />
        <Route
          path="/match-history"
          element={
            isLoggedIn && summonerName && tagLine ? (
            <Navigate to={`/match-history/${summonerName}/${tagLine}`} />
          ) : (
            <Navigate to="/LandingSearch" />
          )
          }
        />
        <Route
         path="/match-history/:summonerName/:tagLine"
         element={<MatchHistoryWrapper />}
        />
        <Route 
          path="/profile" 
          element={isLoggedIn ? <Profile /> : <Navigate to="/" />} 
        />
        <Route 
          path="/favorite-feed" 
          element={isLoggedIn ? <FavoriteFeed /> : <Navigate to="/" />} 
        />
        <Route 
          path="/about-donation" 
          element={<AboutDonation />} 
        />
      </Routes>
    </div>
  );
};

export default App;
