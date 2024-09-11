import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './index.css'; // Ensure this path is correct

const MatchHistory = ({ riotId }) => {
  const [matchHistory, setMatchHistory] = useState(null);
  const [error, setError] = useState(null);
  const [itemData, setItemData] = useState(null);

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

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/14.17.1/data/en_US/item.json');
        setItemData(response.data.data);
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };
    fetchItemData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!matchHistory) {
    return <div>Loading match history...</div>;
  }

  return (
    <div className="match-history-container">
      <h2>Match History</h2>
      <div className="match-history">
        {matchHistory.map((match, index) => {
          const blueTeam = match.participants.filter(participant => participant.teamId === 100);
          const redTeam = match.participants.filter(participant => participant.teamId === 200);

          return (
            <div className="match-card" key={match.matchId || index}>
              <h3 className="match-header">
                Champion: 
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${match.champion}.png`}
                  alt={match.champion}
                  className="champion-icon"
                />
              </h3>
              <p>K/D/A: {match.kills}/{match.deaths}/{match.assists}</p>
              <p>Game Duration: {Math.floor(match.gameDuration / 60)} minutes</p>
              
              <div className="team-section">
                <h4>Blue Side:</h4>
                <ul>
                  {blueTeam.map((participant, pIndex) => (
                    <li key={pIndex}>
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${participant.championName}.png`} 
                        alt={participant.championName}
                        className="champion-icon"
                      />
                      <strong>{participant.summonerName}</strong>: {` ${participant.kills}/${participant.deaths}/${participant.assists}`} |
                      Gold: {participant.goldEarned} |
                      Damage: {participant.totalDamageDealt} |
                      Wards: {participant.wardsPlaced}
                      <div className="item-icons">
                        {participant.items.map((item, iIndex) => (
                          item !== 0 && (
                            <img
                              key={iIndex}
                              src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/item/${item}.png`}
                              alt={`Item ${item}`}
                              className="item-icon"
                              title={itemData[item]?.description || 'No description available'}
                            />
                          )
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="team-section">
                <h4>Red Side:</h4>
                <ul>
                  {redTeam.map((participant, pIndex) => (
                    <li key={pIndex}>
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${participant.championName}.png`} 
                        alt={participant.championName}
                        className="champion-icon"
                      />
                      <strong>{participant.summonerName}</strong>: {` ${participant.kills}/${participant.deaths}/${participant.assists}`} |
                      Gold: {participant.goldEarned} |
                      Damage: {participant.totalDamageDealt} |
                      Wards: {participant.wardsPlaced}
                      <div className="item-icons">
                        {participant.items.map((item, iIndex) => (
                          item !== 0 && (
                            <img
                              key={iIndex}
                              src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/item/${item}.png`}
                              alt={`Item ${item}`}
                              className="item-icon"
                              title={itemData[item]?.description || 'No description available'}
                            />
                          )
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchHistory;
