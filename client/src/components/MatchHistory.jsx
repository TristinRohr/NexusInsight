import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MatchHistory.css";
import QueueInfo from "./QueueType1";
import { Link, useNavigate } from "react-router-dom";
import Tooltip from "./Tooltip";

const MatchHistory = ({ riotId, setSearchTerm }) => {
  const [matchHistory, setMatchHistory] = useState(null);
  const [error, setError] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [openMatch, setOpenMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentSummoners, setRecentSummoners] = useState([]);
  const navigate = useNavigate();

  // Load recent summoners from localStorage
  useEffect(() => {
    const storedSummoners =
      JSON.parse(localStorage.getItem("recentSummoners")) || [];
    setRecentSummoners(storedSummoners);
  }, []);

  // Fetch match history
  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        setLoading(true);
        const [gameName, tagLine] = riotId.split("#");

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

        const response = await axios.post("/graphql", {
          query: graphqlQuery,
          variables: { gameName, tagLine },
        });
        console.log("Match history response:", response.data.data.matchHistory);
        setMatchHistory(response.data.data.matchHistory);
        setLoading(false);

        // Add to recent searches
        const newSummoner = `${gameName}#${tagLine}`;
        updateRecentSummoners(newSummoner);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching match history:", error);
        setError("Failed to fetch match history");
        setLoading(false);
      }
    };

    fetchMatchHistory();
    setOpenMatch(null);
  }, [riotId]);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get(
          "https://ddragon.leagueoflegends.com/cdn/14.18.1/data/en_US/item.json"
        );
        setItemData(response.data.data);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };
    fetchItemData();
  }, []);

  const toggleMatch = (index) => {
    setOpenMatch(openMatch === index ? null : index);
  };

  // Update the recent summoners list and save to localStorage
  const updateRecentSummoners = (summoner) => {
    const updatedSummoners = [
      summoner,
      ...recentSummoners.filter((s) => s !== summoner),
    ].slice(0, 5);
    setRecentSummoners(updatedSummoners);
    localStorage.setItem("recentSummoners", JSON.stringify(updatedSummoners));
  };

  const handleParticipantClick = (summonerName, tagLine) => {
    const searchValue = `${summonerName}#${tagLine}`;
    setSearchTerm(searchValue); // Update search bar state

    // Navigate to the summoner's match history
    navigate(`/match-history/${summonerName}/${tagLine}`);
  };

  const findUserTeamId = (participants, summonerName) => {
    const userParticipant = participants.find(
      (p) => p.summonerName === summonerName
    );
    if (userParticipant) {
      console.log("User found:", userParticipant);
      return userParticipant.teamId;
    }
    console.error("User not found in participants list");
    return null; // Return null if user is not found
  };

  const determineWinStatus = (teamId, teams) => {
    console.log("Team ID:", teamId, "Teams Data:", teams);
    // Log the team the user is on
    console.log("User is on team:", teamId);
    // Log the teams data for further debugging
    console.log("Teams Data:", teams);
    const team = teams.find((t) => t.teamId === teamId);
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

  if (loading) {
    return <div>Loading match history...</div>;
  }
  if (!matchHistory) {
    return <div>No match history found.</div>;
  }

  return (
    <div className="match-history-container">
      <h2 className="match-history-title">Match History</h2>
      <div className="recent-summoners">
        <h4>Recently Searched Summoners:</h4>
        <ul>
          {recentSummoners.map((summoner, index) => (
            <li key={index}>
              <button
                onClick={() => handleParticipantClick(...summoner.split("#"))}
              >
                {summoner}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="match-history-grid">
        {matchHistory.map((match, index) => {
          const blueTeam = match.participants.filter(
            (participant) => participant.teamId === 100
          );
          const redTeam = match.participants.filter(
            (participant) => participant.teamId === 200
          );
          const userTeamId = findUserTeamId(
            match.participants,
            riotId.split("#")[0]
          );
          if (userTeamId === null) {
            return <div key={index}>User not found in match.</div>;
          }
          return (
            <div className="match-card" key={match.matchId || index}>
              <div className="match-header">
                <div className="match-champion">
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/${
                      match.champion === "FiddleSticks"
                        ? "Fiddlesticks"
                        : match.champion
                    }.png`}
                    alt={match.champion}
                    className="champion-icon"
                  />
                  <h3>{match.champion}</h3>
                </div>
                <div className="match-participants">
                  <div className="team blue-team">
                    <ul className="participant-list">
                      {blueTeam.map((participant, pIndex) => (
                        <li key={pIndex} className="participant">
                          <img
                            src={`https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/${
                              participant.championName === "FiddleSticks"
                                ? "Fiddlesticks"
                                : participant.championName
                            }.png`}
                            alt={participant.championName}
                            className="champion-icon"
                          />
                          <span>
                            {participant.summonerName}#
                            {participant.riotIdTagline}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="team red-team">
                    <ul className="participant-list">
                      {redTeam.map((participant, pIndex) => (
                        <li key={pIndex} className="participant">
                          <img
                            src={`https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/${
                              participant.championName === "FiddleSticks"
                                ? "Fiddlesticks"
                                : participant.championName
                            }.png`}
                            alt={participant.championName}
                            className="champion-icon"
                          />
                          <span>
                            {participant.summonerName}#
                            {participant.riotIdTagline}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="match-details-summary">
                  <p>
                    K/D/A: <span className="kda-kills">{match.kills}</span>/
                    <span className="kda-deaths">{match.deaths}</span>/
                    <span className="kda-assists">{match.assists}</span>
                  </p>
                  <p>
                    Game Duration: {Math.floor(match.gameDuration / 60)} minutes
                  </p>
                  <p className="match-result">
                    {determineWinStatus(userTeamId, match.teams)
                      ? "Victory"
                      : "Defeat"}
                  </p>
                  <QueueInfo queueId={match.queueId} className="queue-info" />
                </div>
                <button
                  className="toggle-button"
                  onClick={() => toggleMatch(index)}
                >
                  {openMatch === index ? "Hide Details" : "Show Details"}
                </button>
              </div>

              {openMatch === index && (
                <div className="match-details">
                  <div className="team-section">
                    <div className="team blue-side">
                      <h4>Blue Side</h4>
                      <ul className="participant-grid">
                        <li className="participant-grid-titles participant-grid-row">
                          <div className="grid-title">Champion</div>
                          <div className="grid-title">Summoner</div>
                          <div className="grid-title">KDA</div>
                          <div className="grid-title">Damage</div>
                          <div className="grid-title">Gold</div>
                          <div className="grid-title">Wards</div>
                          <div className="grid-title">CS</div>
                          <div className="grid-title">Items</div>
                        </li>
                        {blueTeam.map((participant, pIndex) => (
                          <li key={pIndex} className="participant-grid-row">
                            <div className="blue-participant-grid-champion">
                              <img
                                src={`https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/${
                                  participant.championName === "FiddleSticks"
                                    ? "Fiddlesticks"
                                    : participant.championName
                                }.png`}
                                alt={participant.championName}
                                className="champion-icon"
                              />
                            </div>
                            <div className="participant-grid-summoner">
                              <span
                                onClick={() =>
                                  handleParticipantClick(
                                    participant.summonerName,
                                    participant.riotIdTagline
                                  )
                                }
                              >
                                {participant.summonerName}#
                                {participant.riotIdTagline}
                              </span>
                            </div>
                            <div className="participant-grid-kda">
                              <span className="kda-kills">
                                {participant.kills}
                              </span>
                              /
                              <span className="kda-deaths">
                                {participant.deaths}
                              </span>
                              /
                              <span className="kda-assists">
                                {participant.assists}
                              </span>
                            </div>
                            <div className="participant-grid-damage">
                              <p className="damage">
                                {participant.totalDamageDealtToChampions}
                              </p>
                            </div>
                            <div className="participant-grid-gold">
                              <p className="gold">{participant.goldEarned}</p>
                            </div>
                            <div className="participant-grid-wards">
                              <p className="wards">{participant.wardsPlaced}</p>
                            </div>
                            <div className="participant-grid-cs">
                              <p className="cs">
                                {participant.totalMinionsKilled}
                              </p>
                            </div>
                            <div className="participant-grid-items">
                              <div className="item-icons">
                                {generateItemSlots(participant.items).map(
                                  (item, iIndex) =>
                                    item !== 0 ? (
                                      <Tooltip
                                        key={iIndex}
                                        itemId={item}
                                        itemData={itemData}
                                      />
                                    ) : (
                                      <div
                                        key={iIndex}
                                        className="item-icon empty-item"
                                      ></div>
                                    )
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="team red-side">
                      <h4>Red Side</h4>
                      <ul className="participant-grid">
                        <li className="participant-grid-titles participant-grid-row">
                          <div className="grid-title">Champion</div>
                          <div class Name="grid-title">
                            Summoner
                          </div>
                          <div className="grid-title">KDA</div>
                          <div className="grid-title">Damage</div>
                          <div className="grid-title">Gold</div>
                          <div className="grid-title">Wards</div>
                          <div className="grid-title">CS</div>
                          <div className="grid-title">Items</div>
                        </li>
                        {redTeam.map((participant, pIndex) => (
                          <li key={pIndex} className="participant-grid-row">
                            <div className="red-participant-grid-champion">
                              <img
                                src={`https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/${
                                  participant.championName === "FiddleSticks"
                                    ? "Fiddlesticks"
                                    : participant.championName
                                }.png`}
                                alt={participant.championName}
                                className="champion-icon"
                              />
                            </div>
                            <div className="participant-grid-summoner">
                              <span
                                onClick={() =>
                                  handleParticipantClick(
                                    participant.summonerName,
                                    participant.riotIdTagline
                                  )
                                }
                              >
                                {participant.summonerName}#
                                {participant.riotIdTagline}
                              </span>
                            </div>
                            <div className="participant-grid-kda">
                              <span className="kda-kills">
                                {participant.kills}
                              </span>
                              /
                              <span className="kda-deaths">
                                {participant.deaths}
                              </span>
                              /
                              <span className="kda-assists">
                                {participant.assists}
                              </span>
                            </div>
                            <div className="participant-grid-damage">
                              <p className="damage">
                                {participant.totalDamageDealtToChampions}
                              </p>
                            </div>
                            <div className="participant-grid-gold">
                              <p className="gold">{participant.goldEarned}</p>
                            </div>
                            <div className="participant-grid-wards">
                              <p className="wards">{participant.wardsPlaced}</p>
                            </div>
                            <div className="participant-grid-cs">
                              <p className="cs">
                                {participant.totalMinionsKilled}
                              </p>
                            </div>
                            <div className="participant-grid-items">
                              <div className="item-icons">
                                {generateItemSlots(participant.items).map(
                                  (item, iIndex) =>
                                    item !== 0 ? (
                                      <img
                                        key={iIndex}
                                        src={`https://ddragon.leagueoflegends.com/cdn/14.18.1/img/item/${item}.png`}
                                        alt={`Item ${item}`}
                                        className="item-icon"
                                      />
                                    ) : (
                                      <div
                                        key={iIndex}
                                        className="item-icon empty-item"
                                      ></div>
                                    )
                                )}
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
