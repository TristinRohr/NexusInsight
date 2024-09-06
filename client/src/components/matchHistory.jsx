import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchHistory = ({ riotId }) => {
  const [matchHistory, setMatchHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const [gameName, tagLine] = riotId.split('#');
        const response = await axios.get(`/api/match-history/${gameName}/${tagLine}`);
        setMatchHistory(response.data);
      } catch (error) {
        setError('Failed to fetch match history');
      }
    };

    fetchMatchHistory();
  }, [riotId]);

  if (error) return <div>{error}</div>;
  if (matchHistory.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h2>Match History</h2>
      {matchHistory.map((match, index) => (
        <div key={index}>
          <h3>Match {index + 1}</h3>
          <p>Win: {match.win ? 'Yes' : 'No'}</p>
          <p>Kills: {match.kills}</p>
          <p>Deaths: {match.deaths}</p>
          <p>Assists: {match.assists}</p>
          <p>Champion: {match.championName}</p>
          <p>Champions in Match:</p>
          <ul>
            {match.champions.map((champion, i) => (
              <li key={i}>{champion}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MatchHistory;