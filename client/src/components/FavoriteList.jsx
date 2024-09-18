import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./FavoriteList.css";

const FavoriteFeed = () => {
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate from react-router-dom

  // Fetch favorite players when the component mounts
  useEffect(() => {
    const fetchFavoritePlayers = async () => {
      try {
        const response = await axios.post("/graphql", {
          query: `
            query {
              getUser {
                favoritePlayers
              }
            }
          `,
        });

        setFavoritePlayers(response.data.data.getUser.favoritePlayers);
      } catch (error) {
        console.error("Error fetching favorite players:", error);
        setError("Failed to fetch favorite players");
      }
    };

    fetchFavoritePlayers();
  }, []);

  // Function to delete a favorite player
  const handleDelete = async (summonerName, tagLine) => {
    try {
      // Mutation to remove the player from the favorites
      const mutation = `
          mutation removeFavoritePlayer($summonerName: String!, $tagLine: String!) {
            removeFavoritePlayer(summonerName: $summonerName, tagLine: $tagLine) {
              favoritePlayers
            }
          }
        `;
      await axios.post("/graphql", {
        query: mutation,
        variables: { summonerName, tagLine },
      });

      // Remove the player from the state after successful deletion
      setFavoritePlayers((prevPlayers) =>
        prevPlayers.filter((player) => player !== `${summonerName}#${tagLine}`)
      );
    } catch (error) {
      console.error("Error removing player:", error);
      setError("Failed to remove favorite player");
    }
  };

  // Function to handle when a favorite player is clicked
  const handlePlayerClick = (summonerName, tagLine) => {
    navigate(`/match-history/${summonerName}/${tagLine}`); // Navigate to match history
  };

  return (
    <div className="favorite-feed-container">
      <h2 className="favorite-feed-title">Favorite Players</h2>

      {error && <p className="error-message">{error}</p>}

      {favoritePlayers.length > 0 ? (
        <ul className="favorite-players-list">
          {favoritePlayers.map((player, index) => {
            const [summonerName, tagLine] = player.split("#"); // Split riotId to summonerName and tagLine
            return (
              <li key={index} className="favorite-player-item">
                {/* Clickable list item to navigate to match history */}
                <span
                  className="favorite-player-link"
                  onClick={() => handlePlayerClick(summonerName, tagLine)}
                >
                  {summonerName}#{tagLine}
                </span>
                <button
                  className="delete-player-btn"
                  onClick={() => handleDelete(summonerName, tagLine)}
                  title="Remove from favorites"
                >
                  ❌
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-favorites-message">
          You have no favorite players yet.
        </p>
      )}
    </div>
  );
};

export default FavoriteFeed;