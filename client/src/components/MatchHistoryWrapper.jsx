import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserStats from './UserStats.jsx';
import MatchHistory from './MatchHistory';

const MatchHistoryWrapper = () => {
  const { summonerName, tagLine } = useParams();
  const navigate = useNavigate();
  
  // State to hold the search term and recent summoners
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSummoners, setRecentSummoners] = useState([]);

  if (!summonerName || !tagLine) {
    return <div>User not found or invalid parameters.</div>;
  }

  // Pass the riotId constructed from summonerName and tagLine to both components
  const riotId = `${summonerName}#${tagLine}`;

  // Load recent summoners from localStorage when the component mounts
  useEffect(() => {
    const storedSummoners = JSON.parse(localStorage.getItem('recentSummoners')) || [];
    setRecentSummoners(storedSummoners);
  }, []);

  // Update the recent summoners list and save to localStorage
  const updateRecentSummoners = (summoner) => {
    const updatedSummoners = [summoner, ...recentSummoners.filter(s => s !== summoner)].slice(0, 5);
    setRecentSummoners(updatedSummoners);
    localStorage.setItem('recentSummoners', JSON.stringify(updatedSummoners));
  };

  // Function to handle clicking a recent summoner, navigating to their match history
  const handleRecentSummonerClick = (summoner) => {
    const [name, tag] = summoner.split('#');
    navigate(`/match-history/${name}/${tag}`);
  };

  // Update recent summoners when a new match history is fetched
  useEffect(() => {
    const currentSummoner = `${summonerName}#${tagLine}`;
    updateRecentSummoners(currentSummoner);
  }, [summonerName, tagLine]);

  return (
    <div>
      {/* Render recent summoners above the match history */}
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

      {/* Render UserStats component */}
      <UserStats riotId={riotId} setSearchTerm={setSearchTerm} />

      {/* Render MatchHistory component with setSearchTerm */}
      <MatchHistory riotId={riotId} setSearchTerm={setSearchTerm} />
    </div>
  );
};

export default MatchHistoryWrapper;
