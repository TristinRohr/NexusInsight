import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import UserStats from './components/UserStats';
import MatchHistory from './components/MatchHistory';
import LiveMatch from './components/LiveMatch';
import LoginRegister from './components/LoginRegister';
import Profile from './components/Profile';
import Feed from './components/Feed';
import FavoritePlayers from './components/FavoritePlayers';
import Search from './components/Search'; // New search component

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
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
        <Route path="/feed" element={isLoggedIn ? <Feed /> : <Navigate to="/" />} />
        <Route
          path="/favorite-players"
          element={isLoggedIn ? <FavoritePlayers /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};

export default App;
