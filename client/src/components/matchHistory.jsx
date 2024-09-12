import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchHistory.css'; // Ensure this file is linked correctly
import QueueInfo from './queueType'; // Import the QueueInfo component

const MatchHistory = ({ riotId }) => {
  const [matchHistory, setMatchHistory] = useState(null);
  const [error, setError] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [openMatch, setOpenMatch] = useState(null);

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
                riotIdTagline
                championName
                kills
                deaths
                assists
                goldEarned
                totalDamageDealtToChampions
                wardsPlaced
                items
                teamId
              }
              teams {
                teamId
                win
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

  const toggleMatch = (index) => {
    setOpenMatch(openMatch === index ? null : index);
  };
  
  const findUserTeamId = (participants, summonerName) => {
    const userParticipant = participants.find(p => p.summonerName === summonerName);
    if (userParticipant) {
      console.log('User found:', userParticipant);
      return userParticipant.teamId;
    }
    console.error('User not found in participants list');
    return null; // Return null if user is not found
  };

  const determineWinStatus = (teamId, teams) => {
    console.log('Team ID:', teamId, 'Teams Data:', teams);
     // Log the team the user is on
    console.log('User is on team:', teamId);
    // Log the teams data for further debugging
    console.log('Teams Data:', teams);
    const team = teams.find(t => t.teamId === teamId);
    return team ? team.win : false;
  };

  const generateItemSlots = (items) => {
    const itemSlots = [...items]; // Copy items array
    while (itemSlots.length < 7) {
      itemSlots.push(0); // Add zeroes to represent empty slots until there are 7 items
    }
    return itemSlots;
  };

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
          const userTeamId = findUserTeamId(match.participants, riotId.split('#')[0]); // Find the correct user by summoner name

          if (userTeamId === null) {
            return <div key={index}>User not found in match.</div>;
          }
          return (
            <div className="match-card" key={match.matchId || index}>
              <div className="match-header" onClick={() => toggleMatch(index)}>
                <h3>Champion: {match.champion}</h3>
                <img 
                  src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${match.champion}.png`} 
                  alt={match.champion}
                  className="champion-icon"
                />
                <p>K/D/A: {match.kills}/{match.deaths}/{match.assists}</p>
                <p>Game Duration: {Math.floor(match.gameDuration / 60)} minutes</p>
                <p className="match-result">
                  {determineWinStatus(userTeamId, match.teams) ? 'Victory' : 'Defeat'}
                </p>
              </div>
              <QueueInfo queueId={match.queueId} />
              
              {openMatch === index && (
                <div className="match-details">
                  <div className="team-section flex-row">
                    <div className="red-side">
                      <h4>Red Side</h4>
                      <ul>
                        {redTeam.map((participant, pIndex) => (
                        <li key={pIndex}>
                        <img 
                          src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${participant.championName}.png`} 
                          alt={participant.championName}
                          className="champion-icon"
                        />
                        <strong>{participant.summonerName}#{participant.riotIdTagline}</strong>
                         <p className="match-kda">K/D/A: {participant.kills}/{participant.deaths}/{participant.assists}</p> {/* KDA on its own line */}
                        <p className="match-stats">
                          Gold: {participant.goldEarned} | Damage: {participant.totalDamageDealtToChampions} | Wards: {participant.wardsPlaced}
                        </p>
                        <div className="item-icons">
                          {generateItemSlots(participant.items).map((item, iIndex) => (
                            item !== 0 ? (
                              <img
                                key={iIndex}
                                src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/item/${item}.png`}
                                alt={`Item ${item}`}
                                className="item-icon"
                                title={itemData[item]?.description || 'No description available'}
                              />
                            ) : (
                               <div key={iIndex} className="item-icon empty-item"></div> // Empty item box
                            )
                          ))}
                        </div>
                      </li>
                        ))}
                      </ul>
                    </div>
                    <div className="blue-side">
                      <h4>Blue Side</h4>
                      <ul>
                        {blueTeam.map((participant, pIndex) => (
                          <li key={pIndex}>
                          <img 
                            src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${participant.championName}.png`} 
                            alt={participant.championName}
                            className="champion-icon"
                          />
                          <strong>{participant.summonerName}#{participant.riotIdTagline}</strong>
                          <p className="match-kda">K/D/A: {participant.kills}/{participant.deaths}/{participant.assists}</p>
                          <p className="match-stats">
                            Gold: {participant.goldEarned} | Damage: {participant.totalDamageDealtToChampions} | Wards: {participant.wardsPlaced}
                          </p>
                          <div className="item-icons">
                            {generateItemSlots(participant.items).map((item, iIndex) => (
                              item !== 0 ? (
                                <img
                                  key={iIndex}
                                  src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/item/${item}.png`}
                                  alt={`Item ${item}`}
                                  className="item-icon"
                                  title={itemData[item]?.description || 'No description available'}
                                />
                              ) : (
                                <div key={iIndex} className="item-icon empty-item"></div> // Empty item box
                              )
                            ))}
                          </div>
                        </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchHistory;