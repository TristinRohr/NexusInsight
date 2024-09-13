import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import UserStats from './components/UserStats';
import MatchHistory from './components/MatchHistory';
import LiveMatch from './components/LiveMatch';
import LoginRegister from './components/LoginRegister';
import Profile from './components/Profile';
import FavoriteFeed from './components/FavoriteFeed'; // Combined component
import Search from './components/Search'; // Search component
import NavBar from './components/NavBar'; // NavBar component
import axios from 'axios';

const App = () => {
  const [summonerName, setSummonerName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleSearch = (name, tag) => {
    setSummonerName(name);
    setTagLine(tag);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/graphql', {
        query: `mutation logout { logout }`
      }, { withCredentials: true }); // Send cookie to clear the token

      setIsLoggedIn(false);
      navigate('/');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/search" /> : <LoginRegister />}
        />
        <Route
          path="/search"
          element={
            isLoggedIn ? (
              <Search onSearch={handleSearch} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/match-history"
          element={
            isLoggedIn && summonerName && tagLine ? (
              <div>
                <UserStats riotId={`${summonerName}#${tagLine}`} />
                <MatchHistory riotId={`${summonerName}#${tagLine}`} />
                <LiveMatch riotId={`${summonerName}#${tagLine}`} />
              </div>
            ) : (
              <Navigate to="/search" />
            )
          }
        />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
        <Route path="/favorite-feed" element={isLoggedIn ? <FavoriteFeed /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
