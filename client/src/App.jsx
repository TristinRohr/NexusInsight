import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import Search from './components/Search';
import UserStats from './components/UserStats';
import MatchHistory from './components/MatchHistory';
import axios from 'axios';
<<<<<<< Updated upstream
import AboutDonation from './components/AboutDonation';
=======
import './App.css';  // Importing the CSS file
>>>>>>> Stashed changes

const App = () => {
  const [summonerName, setSummonerName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isHeader, setIsHeader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleSearch = (name, tag) => {
    setSummonerName(name);
    setTagLine(tag);
    setIsHeader(true);  // Trigger the animation when the search is performed
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
      <header className="app-header">
        <h1>League of Legends Tracker</h1>
        {isLoggedIn && <Search onSearch={handleSearch} isHeader={isHeader} />}
      </header>

      {isLoggedIn && (
        <nav>
          <Link to="/profile">Profile</Link> |{' '}
          <Link to="/match-history">Match History</Link> |{' '}
<<<<<<< Updated upstream
          <Link to="/favorite-feed">Favorite Feed</Link> |{' '}
          <Link to="/about-donation">About Us & Donations</Link> |{' '}
=======
>>>>>>> Stashed changes
          <button onClick={handleLogout}>Logout</button>
        </nav>
      )}
      
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/match-history" /> : <LoginRegister />}
        />
        <Route
          path="/match-history"
          element={
            isLoggedIn && summonerName && tagLine ? (
              <div>
                <UserStats riotId={`${summonerName}#${tagLine}`} />
                <MatchHistory riotId={`${summonerName}#${tagLine}`} />
              </div>
            ) : (
              <Navigate to="/search" />
            )
          }
        />
<<<<<<< Updated upstream
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
        <Route path="/favorite-feed" element={isLoggedIn ? <FavoriteFeed /> : <Navigate to="/" />} />
        <Route path="/about-donation" element={<AboutDonation />} />
=======
>>>>>>> Stashed changes
      </Routes>
    </div>
  );
};

export default App;
