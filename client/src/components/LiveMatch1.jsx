import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LiveMatch = ({ riotId }) => {
  const [liveMatch, setLiveMatch] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveMatch = async () => {
      try {
        const [gameName, tagLine] = riotId.split('#');

        const graphqlQuery = `
          query getLiveMatch($gameName: String!, $tagLine: String!) {
            liveMatch(gameName: $gameName, tagLine: $tagLine) {
              gameId
              participants {
                summonerName
                championName
                kills
                deaths
                assists
              }
            }
          }
        `;

        const response = await axios.post('/graphql', {
          query: graphqlQuery,
          variables: { gameName, tagLine }
        });

        setLiveMatch(response.data.data.liveMatch);
      } catch (error) {
        console.error('Error fetching live match data:', error);
        setError('Failed to fetch live match data');
      }
    };

    fetchLiveMatch();
  }, [riotId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!liveMatch) {
    return <div>No live match data available</div>;
  }

  return (
    <div>
      <h2>Live Match</h2>
      <p>Game ID: {liveMatch.gameId}</p>
      {liveMatch.participants.map((participant, index) => (
        <div key={index}>
          <p>Summoner: {participant.summonerName}</p>
          <p>Champion: {participant.championName}</p>
          <p>K/D/A: {participant.kills}/{participant.deaths}/{participant.assists}</p>
        </div>
      ))}
    </div>
  );
};

export default LiveMatch;