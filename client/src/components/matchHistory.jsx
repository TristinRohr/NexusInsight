import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchHistory.css';
import QueueInfo from './queueType';

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
              queueId
              participants {
                summonerName
                riotIdTagline
                championName
                kills
                deaths
                assists
                goldEarned
                totalMinionsKilled
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
    return userParticipant ? userParticipant.teamId : null;
  };

  const determineWinStatus = (teamId, teams) => {
    const team = teams.find(t => t.teamId === teamId);
    return team ? team.win : false;
  };

  const generateItemSlots = (items) => {
    const itemSlots = [...items];
    while (itemSlots.length < 7) {
      itemSlots.push(0);
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
      <h2 className="match-history-title">Match History</h2>
      <div className="match-history-grid">
        {matchHistory.map((match, index) => {
          const blueTeam = match.participants.filter(participant => participant.teamId === 100);
          const redTeam = match.participants.filter(participant => participant.teamId === 200);
          const userTeamId = findUserTeamId(match.participants, riotId.split('#')[0]);

          if (userTeamId === null) {
            return <div key={index}>User not found in match.</div>;
          }

          return (
            <div className="match-card" key={match.matchId || index} onClick={() => toggleMatch(index)}>
              <div className="match-header">
                {/* Champion and user info */}
                <div className="match-champion">
                  <img 
                    src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${match.champion}.png`} 
                    alt={match.champion}
                    className="champion-icon"
                  />
                  <h3>{match.champion}</h3>
                </div>

                {/* Match participants (blue and red teams) */}
                <div className="match-participants">
                  <div className="team blue-team">
                    <ul className="participant-list">
                      {blueTeam.map((participant, pIndex) => (
                        <li key={pIndex} className="participant">
                          <img 
                            src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${participant.championName}.png`} 
                            alt={participant.championName}
                            className="blue-participant-icon"
                          />
                          <span>{participant.summonerName}#{participant.riotIdTagline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="team red-team">
                    <ul className="participant-list">
                      {redTeam.map((participant, pIndex) => (
                        <li key={pIndex} className="participant">
                          <img 
                            src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${participant.championName}.png`} 
                            alt={participant.championName}
                            className="red-participant-icon"
                          />
                          <span>{participant.summonerName}#{participant.riotIdTagline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Match summary and queue info */}
                <div className="match-details-summary">
                  <p>K/D/A: <span className="kda-kills">{match.kills}</span>/<span className="kda-deaths">{match.deaths}</span>/<span className="kda-assists">{match.assists}</span></p>
                  <p>Game Duration: {Math.floor(match.gameDuration / 60)} minutes</p>
                  <p className="match-result">
                    {determineWinStatus(userTeamId, match.teams) ? 'Victory' : 'Defeat'}
                  </p>
                  <QueueInfo queueId={match.queueId} className="queue-info" />
                </div>
              </div>
              
              {openMatch === index && (
                <div className="match-details">
                  <div className="team-section">
                    {/* Red and Blue side expanded details */}
                    <div className="team red-side">
                      <h4>Red Side</h4>
                      <ul className="participant-grid">
                      <li className="participant-grid-row">
                            <div className="participant-grid-champion">
                              <strong>Champion</strong>
                            </div>
                            <div className="participant-grid-summoner">
                              <strong>Summoner</strong>
                            </div>
                            <div className="participant-grid-kda">
                              <strong>K/D/A</strong>
                            </div>
                            <div className="participant-grid-damage">
                              <strong>Damage</strong>
                            </div>
                            <div className="participant-grid-gold">
                              <strong>Gold</strong>
                            </div>
                            <div className="participant-grid-wards">
                              <strong>Wards</strong>
                            </div>
                            <div className="participant-grid-cs">
                              <strong>CS</strong>
                            </div>
                            <div className="participant-grid-items">
                              <strong>Items</strong>
                            </div>
                          </li>
                        {redTeam.map((participant, pIndex) => (
                          <li key={pIndex} className="participant-grid-row">
                            <div className="red-participant-grid-champion">
                              <img 
                                src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${participant.championName}.png`} 
                                alt={participant.championName}
                                className="champion-icon"
                              />
                            </div>
                            <div className="participant-grid-summoner">
                              <strong>{participant.summonerName}#{participant.riotIdTagline}</strong>
                            </div>
                            <div className="participant-grid-kda">
                              <span className="kda-kills">{participant.kills}</span>/<span className="kda-deaths">{participant.deaths}</span>/<span className="kda-assists">{participant.assists}</span>
                            </div>
                            <div className="participant-grid-damage">
                              <p className="damage">{participant.totalDamageDealtToChampions}</p>
                            </div>
                            <div className="participant-grid-gold">
                              <p className="gold">{participant.goldEarned}</p>
                            </div>
                            <div className="participant-grid-wards">
                              <p className="wards">{participant.wardsPlaced}</p>
                            </div>
                            <div className="participant-grid-cs">
                              <p className="cs">{participant.totalMinionsKilled}</p>
                            </div>
                            <div className="participant-grid-items">
                              <div className="item-icons">
                                {generateItemSlots(participant.items).map((item, iIndex) => (
                                  item !== 0 ? (
                                    <img
                                      key={iIndex}
                                      src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/item/${item}.png`}
                                      alt={`Item ${item}`}
                                      className="item-icon"
                                    />
                                  ) : (
                                    <div key={iIndex} className="item-icon empty-item"></div>
                                  )
                                ))}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="team blue-side">
                      <h4>Blue Side</h4>
                      <ul className="participant-grid">
                      <li className="participant-grid-row">
                            <div className="participant-grid-champion">
                              <strong>Champion</strong>
                            </div>
                            <div className="participant-grid-summoner">
                              <strong>Summoner</strong>
                            </div>
                            <div className="participant-grid-kda">
                              <strong>K/D/A</strong>
                            </div>
                            <div className="participant-grid-damage">
                              <strong>Damage</strong>
                            </div>
                            <div className="participant-grid-gold">
                              <strong>Gold</strong>
                            </div>
                            <div className="participant-grid-wards">
                              <strong>Wards</strong>
                            </div>
                            <div className="participant-grid-cs">
                              <strong>CS</strong>
                            </div>
                            <div className="participant-grid-items">
                              <strong>Items</strong>
                            </div>
                          </li>                        
                        {blueTeam.map((participant, pIndex) => (
                          <li key={pIndex} className="participant-grid-row">
                            <div className="blue-participant-grid-champion">
                              <img 
                                src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${participant.championName}.png`} 
                                alt={participant.championName}
                                className="champion-icon"
                              />
                            </div>
                            <div className="participant-grid-summoner">
                              <strong>{participant.summonerName}#{participant.riotIdTagline}</strong>
                            </div>
                            <div className="participant-grid-kda">
                              <span className="kda-kills">{participant.kills}</span>/<span className="kda-deaths">{participant.deaths}</span>/<span className="kda-assists">{participant.assists}</span>
                            </div>
                            <div className="participant-grid-damage">
                              <p className="damage">{participant.totalDamageDealtToChampions}</p>
                            </div>
                            <div className="participant-grid-gold">
                              <p className="gold">{participant.goldEarned}</p>
                            </div>
                            <div className="participant-grid-wards">
                              <p className="wards">{participant.wardsPlaced}</p>
                            </div>
                            <div className="participant-grid-cs">
                              <p className="cs">{participant.totalMinionsKilled}</p>
                            </div>
                            <div className="participant-grid-items">
                              <div className="item-icons">
                                {generateItemSlots(participant.items).map((item, iIndex) => (
                                  item !== 0 ? (
                                    <img
                                      key={iIndex}
                                      src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/item/${item}.png`}
                                      alt={`Item ${item}`}
                                      className="item-icon"
                                    />
                                  ) : (
                                    <div key={iIndex} className="item-icon empty-item"></div>
                                  )
                                ))}
                              </div>
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
