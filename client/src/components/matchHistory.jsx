import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchHistory = ({ riotId }) => {
  const [matchHistory, setMatchHistory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const [gameName, tagLine] = riotId.split('#');

        const graphqlQuery = `
          query getMatchHistory($gameName: String!, $tagLine: String!) {
            matchHistory(gameName: $gameName, tagLine: $tagLine) {
              matchId
              champion
              kills
              deaths
              assists
            }
          }
        `;

        const response = await axios.post('/graphql', {
          query: graphqlQuery,
          variables: { gameName, tagLine }
        });

        setMatchHistory(response.data.data.matchHistory);
        console.log('Fetched match history:', response.data.data.matchHistory);
      } catch (error) {
        console.error('Error fetching match history:', error);
        setError('Failed to fetch match history');
      }
    };

    fetchMatchHistory();
  }, [riotId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!matchHistory) {
    return <div>Loading match history...</div>;
  }

  return (
    <div>
      <h2>Match History</h2>
      {matchHistory.map((match, index) => (
        <div key={match.matchId || index}>
          <p>Champion: {match.champion || 'Unknown Champion'}</p>
          <p>K/D/A: {match.kills}/{match.deaths}/{match.assists}</p>
        </div>
      ))}
    </div>
  );
};

export default MatchHistory;
