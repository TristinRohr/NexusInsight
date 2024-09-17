import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserStats.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UserStats = ({ riotId }) => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [summonerName, tagLine] = riotId.split("#");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const graphqlQuery = `
          query getUserStats($summonerName: String!, $tagLine: String!) {
            userStats(gameName: $summonerName, tagLine: $tagLine) {
              id
              accountId
              puuid
              name
              summonerLevel
              profileIconId
              leagueInfo {
                queueType
                tier
                rank
                leaguePoints
                wins
                losses
              }
            }
          }
        `;
        const response = await axios.post("/graphql", {
          query: graphqlQuery,
          variables: { summonerName, tagLine },
        });
        if (response.data && response.data.data && response.data.data.userStats) {
          setUserStats(response.data.data.userStats);
        } else {
          setError("No user stats found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setError("Failed to fetch user stats");
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const favoritesResponse = await axios.post("/graphql", {
          query: `
            query getUserFavorites {
              getUser {
                favoritePlayers
              }
            }
          `,
        });
  
        // Ensure favoritePlayers is present in the response
        const favoritePlayers = favoritesResponse.data?.data?.getUser?.favoritePlayers;
  
        if (favoritePlayers) {
          setIsFavorite(favoritePlayers.includes(riotId));
        } else {
          setIsFavorite(false); // Or handle case for no favorites
        }
      } catch (err) {
        console.error("Error fetching favorite players:", err);
      }
    };

    fetchUserStats();
    fetchFavorites();
  }, [riotId, summonerName, tagLine]);

  const handleToggleFavorite = async () => {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      navigate('/login', { state: { message: 'Please log in to favorite players' } });
      return;
    }

    try {
      let mutation = "";
      if (isFavorite) {
        mutation = `
          mutation removeFavoritePlayer($summonerName: String!, $tagLine: String!) {
            removeFavoritePlayer(summonerName: $summonerName, tagLine: $tagLine) {
              favoritePlayers
            }
          }
        `;
      } else {
        mutation = `
          mutation addFavoritePlayer($summonerName: String!, $tagLine: String!) {
            addFavoritePlayer(summonerName: $summonerName, tagLine: $tagLine) {
              favoritePlayers
            }
          }
        `;
      }

      await axios.post("/graphql", {
        query: mutation,
        variables: { summonerName, tagLine },
      });

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  if (loading) {
    return <div className="user-stats-container">Loading user stats...</div>;
  }

  if (error) {
    return <div className="user-stats-container">{error}</div>;
  }

  return (
    <div className="user-stats-container">
      <div className="user-profile">
        <div className="favorite-toggle">
          <button onClick={handleToggleFavorite} className="favorite-button">
            <FontAwesomeIcon
              icon={solidHeart}
              style={{ color: isFavorite ? "red" : "black" }}
            />
          </button>
        </div>
        <div className="summoner-icon-container">
          <div className="level-badge">{userStats.summonerLevel}</div>
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/14.18.1/img/profileicon/${userStats.profileIconId}.png`}
            alt="Profile Icon"
            className="summoner-icon"
          />
        </div>
        <h2>{summonerName}#{tagLine}</h2>
      </div>

      <div className="rank-info-header">
        <h3>Ranked</h3>
        <div className="rank-info-container">
          {userStats.leagueInfo.length > 0 ? (
            userStats.leagueInfo.map((league, index) => (
              <div key={index} className="rank-info-item">
                <p>{league.queueType.replace(/_/g, " ")}</p>
                <img
                  className="rank-icon"
                  src={`/Rank=${league.tier}.png`}
                  alt={league.tier}
                  width="50"
                  height="50"
                />
                <p>{league.tier} {league.rank}</p>
                <p>{league.leaguePoints} LP</p>
                <p>{league.wins}W / {league.losses}L</p>
              </div>
            ))
          ) : (
            <p>No ranked data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStats;
