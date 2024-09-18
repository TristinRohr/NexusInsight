import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FavoriteList.css";
import { useNavigate } from "react-router-dom";

const FavoriteFeed = () => {
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch favorite players from the backend using GraphQL
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
        const players = response.data.data.getUser.favoritePlayers.map(player => {
          const [summonerName, tagLine] = player.split("#");
          return { summonerName, tagLine };
        });

        setFavoritePlayers(players);
      } catch (error) {
        console.error("Error fetching favorite players:", error);
        setError("Failed to fetch favorite players");
      }
    };

    fetchFavoritePlayers();
  }, []);

  // Search handler function to save search history and navigate to match history
  const searchHandler = (gameName, tag) => {
    const summoner = `${gameName}#${tag}`;
  
    // Load and update the recently searched summoners in localStorage
    let recentSearches = JSON.parse(localStorage.getItem('recentSummoners')) || [];
    recentSearches = [summoner, ...recentSearches.filter(s => s !== summoner)].slice(0, 5);
    localStorage.setItem('recentSummoners', JSON.stringify(recentSearches));
  
    // Navigate to the match history page
    navigate(`/match-history/${gameName}/${tag}`);
  };

  // Handle click event on a favorite player
  const handleClick = (summonerName, tagLine) => {
    searchHandler(summonerName, tagLine); // Call the searchHandler
  };

  return (
    <div className="favorite-feed-container">
      <h2 className="favorite-feed-title">Favorite Players</h2>

      {error && <p className="error-message">{error}</p>}

      {favoritePlayers.length > 0 ? (
        <ul className="favorite-player-list">
          {favoritePlayers.map((player, index) => (
            <li key={index} className="favorite-player-item">
              <button 
                onClick={() => handleClick(player.summonerName, player.tagLine)} 
                className="favorite-player-link"
              >
                {player.summonerName}#{player.tagLine}
              </button>
            </li>
          ))}
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