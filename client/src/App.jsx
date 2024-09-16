import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';  // Importing the CSS file
import NavBar from './components/NavBar';
import LoginRegister from './components/LoginRegister';
import Profile from './components/Profile';
import FavoriteFeed from './components/FavoriteList';
import LandingSearch from './components/LandingSearch';
import MatchHistoryWrapper from './components/MatchHistoryWrapper';
import AboutDonation1 from './components/AboutDonation';
import StripeSuccess from './components/StripeSuccess';  // Import SuccessPage
import StripeCancel from './components/StripeCancel';   // Import CancelPage

const App = () => {
  // State to store summonerName and tagLine, initially loading from localStorage
  const [summonerName, setSummonerName] = useState(localStorage.getItem('summonerName') || '');
  const [tagLine, setTagLine] = useState(localStorage.getItem('tagLine') || '');
  
  // Check if user is logged in based on the presence of a token in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  
  // State for tracking whether the search header should animate
  const [isHeader, setIsHeader] = useState(false);
  
  const navigate = useNavigate();

  // Effect to ensure the `isLoggedIn` state is updated if the token is in localStorage
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  // Add useEffect to listen for changes in localStorage when token is set/removed
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to handle search and navigate to the match history page
  const searchHandler = (gameName, tag) => {
    const summoner = `${gameName}#${tag}`;
  
    // Load and update the recently searched summoners in localStorage
    let recentSearches = JSON.parse(localStorage.getItem('recentSummoners')) || [];
    recentSearches = [summoner, ...recentSearches.filter(s => s !== summoner)].slice(0, 5);
    localStorage.setItem('recentSummoners', JSON.stringify(recentSearches));
  
    // Update state and localStorage, and navigate to the match history page
    setSummonerName(gameName);
    setTagLine(tag);
    localStorage.setItem('summonerName', gameName);
    localStorage.setItem('tagLine', tag);
    setIsHeader(true);
    navigate(`/match-history/${gameName}/${tag}`);
  };

  // Function to handle user logout and clear stored data
  const handleLogout = async () => {
    try {
      await axios.post('/graphql', {
        query: `mutation logout { logout }`
      }, { withCredentials: true });

      // Clear stored data upon logout
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('summonerName');
      localStorage.removeItem('tagLine');
      navigate('/login');  // Redirect to login page
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <div>
      {/* NavBar component with search and logout functionality */}
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} handleSearch={searchHandler} isHeader={isHeader} />
      
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingSearch onSearch={searchHandler} />} />
        <Route path="/LandingSearch" element={<LandingSearch onSearch={searchHandler} />} />

        {/* Match History Route */}
        <Route
          path="/match-history/:summonerName/:tagLine"
          element={<MatchHistoryWrapper summonerName={summonerName} tagLine={tagLine} />}
        />

        {/* Profile Route (protected) */}
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Favorite Feed Route (protected) */}
        <Route
          path="/favorite-feed"
          element={isLoggedIn ? <FavoriteFeed /> : <Navigate to="/login" />}
        />

        {/* Login/Register Route */}
        <Route
          path="/login"
          element={<LoginRegister />}
        />

        {/* Success and Cancel Routes for Stripe */}
        <Route path="/success" element={<StripeSuccess />} />
        <Route path="/cancel" element={<StripeCancel />} />

        {/* Catch-all: Redirect to LandingSearch if no route matches */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/about" element={<AboutDonation1 />} />
      </Routes>
    </div>
  );
};

export default App;
