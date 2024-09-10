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
              gameStartTimestamp
              gameDuration
              champion
              kills
              deaths
              assists
              participants {
                summonerName
                championName
                kills
                deaths
                assists
                goldEarned
                totalDamageDealt
                wardsPlaced
                items
              }
            }
          }
        `;

        const response = await axios.post('/graphql', {
          query: graphqlQuery,
          variables: { gameName, tagLine }
        });

        setMatchHistory(response.data.data.matchHistory);
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
          <h3>Champion: {match.champion}</h3>
          <p>K/D/A: {match.kills}/{match.deaths}/{match.assists}</p>
          <p>Game Duration: {Math.floor(match.gameDuration / 60)} minutes</p>
          <h4>Participants:</h4>
          <ul>
            {match.participants.map((participant, pIndex) => (
              <li key={pIndex}>
                <strong>{participant.summonerName}</strong> ({participant.championName}): 
                {` ${participant.kills}/${participant.deaths}/${participant.assists}`} | 
                Gold: {participant.goldEarned} | 
                Damage: {participant.totalDamageDealt} | 
                Wards: {participant.wardsPlaced}
                <br/>
                Items: {participant.items.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MatchHistory;
