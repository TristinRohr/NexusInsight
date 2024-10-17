import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route, Link } from 'react-router-dom';
import UserStats from './UserStats.jsx';
import MatchHistory from './MatchHistory';
import LiveGame from './LiveGame'; // Import the LiveGame component

const MatchHistoryWrapper = () => {
  const { summonerName: paramSummonerName, tagLine: paramTagLine } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSummoners, setRecentSummoners] = useState([]);
  const [activeTab, setActiveTab] = useState('match-history'); // State to track active tab

  const summonerName = paramSummonerName;
  const tagLine = paramTagLine;

  if (!summonerName || !tagLine) {
    return <div>User not found or invalid parameters.</div>;
  }

  const riotId = `${summonerName}#${tagLine}`;

  useEffect(() => {
    const storedSummoners = JSON.parse(localStorage.getItem('recentSummoners')) || [];
    setRecentSummoners(storedSummoners);
  }, []);

  const updateRecentSummoners = (summoner) => {
    const updatedSummoners = [summoner, ...recentSummoners.filter(s => s !== summoner)].slice(0, 5);
    setRecentSummoners(updatedSummoners);
    localStorage.setItem('recentSummoners', JSON.stringify(updatedSummoners));
  };

  const handleRecentSummonerClick = (summoner) => {
    const [name, tag] = summoner.split('#');
    navigate(`/match-history/${name}/${tag}`);
  };

  useEffect(() => {
    const currentSummoner = `${summonerName}#${tagLine}`;
    updateRecentSummoners(currentSummoner);
  }, [summonerName, tagLine]);

  // Function to switch between tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="recent-summoners">
        <h4>Recently Searched Summoners:</h4>
        <ul>
          {recentSummoners.map((summoner, index) => (
            <li key={index}>
              <button onClick={() => handleRecentSummonerClick(summoner)}>
                {summoner}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <UserStats riotId={riotId} setSearchTerm={setSearchTerm} />

      {/* Tabs for switching between Match History and Live Game */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'match-history' ? 'active' : ''}`}
          onClick={() => handleTabChange('match-history')}
        >
          Match History
        </button>
        <button
          className={`tab-button ${activeTab === 'live-game' ? 'active' : ''}`}
          onClick={() => handleTabChange('live-game')}
        >
          Live Game
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="tab-content">
        {activeTab === 'match-history' ? (
          <MatchHistory riotId={riotId} setSearchTerm={setSearchTerm} />
        ) : (
          <LiveGame riotId={riotId} setSearchTerm={setSearchTerm} />
        )}
      </div>
    </div>
  );
};

export default MatchHistoryWrapper;