import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserStats from './UserStats.jsx';
import MatchHistory from './MatchHistory';

const MatchHistoryWrapper = () => {
  const { summonerName: paramSummonerName, tagLine: paramTagLine } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSummoners, setRecentSummoners] = useState([]);

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
      <MatchHistory riotId={riotId} setSearchTerm={setSearchTerm} />
    </div>
  );
};

export default MatchHistoryWrapper;
