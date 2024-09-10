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
                teamId
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
      {matchHistory.map((match, index) => {
        // Split participants into blue and red teams
        const blueTeam = match.participants.filter(participant => participant.teamId === 100);
        const redTeam = match.participants.filter(participant => participant.teamId === 200);

          return (
            <div key={match.matchId || index}>
              <h3>Champion: 
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${match.champion}.png`} 
                  alt={match.champion} 
                  width="50" 
                  height="50">
                </img></h3>
                <p>K/D/A: {match.kills}/{match.deaths}/{match.assists}</p>
                <p>Game Duration: {Math.floor(match.gameDuration / 60)} minutes</p>
                <h4>Blue Side:</h4>
                <ul>
              {blueTeam.map((participant, pIndex) => (
              <li key={pIndex}>
              <img 
                src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${participant.championName}.png`} 
                alt={participant.championName} 
                width="50" 
                height="50" 
              />
              <strong>{participant.summonerName}</strong>: 
              {` ${participant.kills}/${participant.deaths}/${participant.assists}`} | 
              Gold: {participant.goldEarned} | 
              Damage: {participant.totalDamageDealt} | 
              Wards: {participant.wardsPlaced}
              <br/>
              Items: 
              {participant.items.map((item, iIndex) => (
                item !== 0 && (  // Ensure the item slot is not empty (ID of 0)
                  <img
                    key={iIndex}
                    src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/item/${item}.png`}
                    alt={`Item ${item}`}
                    width="30"
                    height="30"
                    style={{ marginRight: '5px' }} // Optional: adds some space between item images
                  />
                )
              ))}
            </li>
              ))}
            </ul>
            <h4>Red Side</h4>
            <ul>
              {redTeam.map((participant, pIndex) => (
             <li key={pIndex}>
             <img 
               src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${participant.championName}.png`} 
               alt={participant.championName} 
               width="50" 
               height="50" 
             />
             <strong>{participant.summonerName}</strong>: 
             {` ${participant.kills}/${participant.deaths}/${participant.assists}`} | 
             Gold: {participant.goldEarned} | 
             Damage: {participant.totalDamageDealt} | 
             Wards: {participant.wardsPlaced}
             <br/>
             Items: 
             {participant.items.map((item, iIndex) => (
               item !== 0 && (  // Ensure the item slot is not empty (ID of 0)
                 <img
                   key={iIndex}
                   src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/item/${item}.png`}
                   alt={`Item ${item}`}
                   width="30"
                   height="30"
                   style={{ marginRight: '5px' }} // Optional: adds some space between item images
                 />
               )
             ))}
           </li>
              ))}
            </ul>
        </div>
      )})}
    </div>
  );
};

export default MatchHistory;
