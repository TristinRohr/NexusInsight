import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import UserStats from './components/UserStats';
import MatchHistory from './components/MatchHistory';
import LiveMatch from './components/LiveMatch';
import LoginRegister from './components/LoginRegister';
import Profile from './components/Profile';
import Feed from './components/Feed';
import FavoritePlayers from './components/FavoritePlayers';

const App = () => {
  const [summonerName, setSummonerName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Check login status on load
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  useEffect(() => {
    // Re-check login status if the token changes in localStorage
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleSearch = (name, tag) => {
    setSummonerName(name);
    setTagLine(tag);
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Update the state
    setIsLoggedIn(false);
    // Redirect to the login page
    navigate('/');
  };

  return (
    <div>
      <h1>League of Legends Tracker</h1>
      {isLoggedIn && (
        <nav>
          <Link to="/profile">Profile</Link> |{' '}
          <Link to="/match-history">Match History</Link> |{' '}
          <Link to="/feed">Feed</Link> |{' '}
          <Link to="/favorite-players">Favorite Players</Link> |{' '}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      )}
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/match-history" /> : <LoginRegister />}
        />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
        <Route
          path="/match-history"
          element={
            isLoggedIn ? (
              <div>
                <UserStats riotId={`${summonerName}#${tagLine}`} />
                <MatchHistory riotId={`${summonerName}#${tagLine}`} />
                <LiveMatch riotId={`${summonerName}#${tagLine}`} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/feed" element={isLoggedIn ? <Feed /> : <Navigate to="/" />} />
        <Route path="/favorite-players" element={isLoggedIn ? <FavoritePlayers /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
