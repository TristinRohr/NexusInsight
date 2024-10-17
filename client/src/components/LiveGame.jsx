import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LiveGame.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const runeImageMap = {
  8005: "precision/press-the-attack/press-the-attack.png", // Press the Attack
  8021: "precision/fleet-footwork/fleet-footwork.png", // Fleet Footwork
  8437: "resolve/grasp-of-the-undying/grasp-of-the-undying.png", // Grasp of the Undying
  8465: "resolve/guardian/guardian.png", // Guardian
  8100: "domination/domination.png", // Domination
  8200: "sorcery/sorcery.png", // Sorcery
  8400: "resolve/resolve.png", // Resolve
  8000: "precision/precision.png", // Precision
  // Add other rune mappings as needed
};

const LiveGame = ({ riotId, setSearchTerm }) => {
  const [liveGameData, setLiveGameData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openPlayer, setOpenPlayer] = useState(null);
  const navigate = useNavigate();

  const baseRuneUrl =
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/";

  const fetchLiveGameData = async () => {
    try {
      setLoading(true);

      const graphqlQuery = `
         query getLiveClientData {
          getLiveClientData {
            activePlayer {
              abilities {
                Q { displayName abilityLevel }
                W { displayName abilityLevel }
                E { displayName abilityLevel }
                R { displayName abilityLevel }
                Passive { displayName }
              }
              championStats {
                abilityPower
                armor
                attackDamage
                attackRange
                currentHealth
                maxHealth
                moveSpeed
                resourceType
                resourceValue
              }
              currentGold
              level
              summonerName
              fullRunes {
                keystone {
                  id
                  displayName
                }
                secondaryRuneTree {
                  id
                  displayName
                }
              }
            }
            allPlayers {
              championName
              summonerName
              team
              scores {
                kills
                deaths
                assists
              }
              summonerSpells {
                summonerSpellOne { displayName }
                summonerSpellTwo { displayName }
              }
              runes {
                keystone {
                  id
                  displayName
                }
                secondaryRuneTree {
                  id
                  displayName
                }
              }
              items {
                itemID
                displayName
                price
              }
            }
            gameData {
              gameMode
              mapName
              gameTime
            }
          }
        }
      `;

      const response = await axios.post(
        "/graphql",
        { query: graphqlQuery },
        { headers: { "Content-Type": "application/json" } }
      );

      setLiveGameData(response.data.data.getLiveClientData);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch live game data");
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLiveGameData();
    }, 15000); // Fetch every 15 seconds

    return () => clearInterval(intervalId);
  }, []);

  const togglePlayer = (index) => {
    setOpenPlayer(openPlayer === index ? null : index);
  };

  const renderRuneImage = (runeId) => {
    const imagePath = runeImageMap[runeId];
    if (!imagePath) return null;
    return (
      <img
        src={`${baseRuneUrl}${imagePath}`}
        alt="Rune"
        style={{ width: "32px", height: "32px", marginRight: "10px" }}
      />
    );
  };

  // Function to calculate total gold spent on items
  const calculateGoldSpent = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="live-game-container">
      <h2 className="live-game-title">Live Game Data</h2>

      {/* Game Information */}
      {liveGameData && (
        <>
          <div className="game-info">
            <h3>Game Mode: {liveGameData.gameData.gameMode}</h3>
            <h4>Map: {liveGameData.gameData.mapName}</h4>
            <h4>Game Time: {Math.floor(liveGameData.gameData.gameTime / 60)} minutes</h4>
          </div>

          {/* Active Player Information */}
          <div className="active-player-section">
            <h3>Active Player: {liveGameData.activePlayer.summonerName}</h3>
            <p>Level: {Math.floor(liveGameData.activePlayer.level)}</p>
            <p>Gold: {Math.floor(liveGameData.activePlayer.currentGold)}</p>
            <h4>Abilities</h4>
            <ul>
              <li>{liveGameData.activePlayer.abilities.Passive.displayName} (Passive)</li>
              <li>
                {liveGameData.activePlayer.abilities.Q.displayName} (Q) - Level{" "}
                {liveGameData.activePlayer.abilities.Q.abilityLevel}
              </li>
              <li>
                {liveGameData.activePlayer.abilities.W.displayName} (W) - Level{" "}
                {liveGameData.activePlayer.abilities.W.abilityLevel}
              </li>
              <li>
                {liveGameData.activePlayer.abilities.E.displayName} (E) - Level{" "}
                {liveGameData.activePlayer.abilities.E.abilityLevel}
              </li>
              <li>
                {liveGameData.activePlayer.abilities.R.displayName} (R) - Level{" "}
                {liveGameData.activePlayer.abilities.R.abilityLevel}
              </li>
            </ul>
            <h4>Runes</h4>
            <div>
              <p>Keystone: {renderRuneImage(liveGameData.activePlayer.fullRunes.keystone.id)}</p>
              <p>
                Secondary Rune Tree:{" "}
                {renderRuneImage(liveGameData.activePlayer.fullRunes.secondaryRuneTree.id)}
              </p>
            </div>
          </div>

          {/* All Players Information */}
          <div className="players-section">
            <h3>All Players</h3>
            {liveGameData.allPlayers.map((player, index) => {
              // Create liveItems array and calculate total gold spent
              const liveItems = player.items || [];
              const totalGoldSpent = calculateGoldSpent(liveItems);

              return (
                <div className="player-card" key={player.summonerName}>
                  <div className="player-header">
                    <div className="player-name">
                      {player.summonerName} - {player.championName}
                    </div>
                    <div className="player-team">Team: {player.team}</div>
                    <div className="player-kda">
                      K/D/A: {Math.floor(player.scores.kills)}/
                      {Math.floor(player.scores.deaths)}/
                      {Math.floor(player.scores.assists)}
                    </div>
                    <div className="player-runes">
                      Runes: Keystone -{" "}
                      {renderRuneImage(player.runes.keystone.id)}, Secondary Rune Tree -{" "}
                      {renderRuneImage(player.runes.secondaryRuneTree.id)}
                    </div>
                    <div className="player-spells">
                      Spells: {player.summonerSpells.summonerSpellOne.displayName},{" "}
                      {player.summonerSpells.summonerSpellTwo.displayName}
                    </div>
                    <div className="player-items">
                      <h4>Items:</h4>
                      <ul>
                        {liveItems.map((item) => (
                          <li key={item.itemID}>
                            {item.displayName} - {item.price} gold
                          </li>
                        ))}
                      </ul>
                      <p>Total Gold Spent: {totalGoldSpent} gold</p>
                    </div>
                    <button
                      className="toggle-button"
                      onClick={() => togglePlayer(index)}
                    >
                      <FontAwesomeIcon
                        icon={openPlayer === index ? faChevronUp : faChevronDown}
                        className="arrow-icon"
                      />
                    </button>
                  </div>

                  {openPlayer === index && (
                    <div className="player-details">
                      {/* Additional player details can be added here */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LiveGame;