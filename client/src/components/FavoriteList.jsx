import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './FavoriteList.css';

const FavoriteFeed = () => {
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoritePlayers = async () => {
      try {
        const response = await axios.post('/graphql', {
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
        console.error('Error fetching favorite players:', error);
        setError('Failed to fetch favorite players');
      }
    };

    fetchFavoritePlayers();
  }, []);

  return (
    <div className="favorite-feed-container">
      <h2 className="favorite-feed-title">Favorite Players</h2>

      {error && <p className="error-message">{error}</p>}

      {favoritePlayers.length > 0 ? (
        <ul className="favorite-players-list">
          {favoritePlayers.map((player, index) => {
            const [summonerName, tagLine] = player.split('#'); // Split riotId to summonerName and tagLine
            return (
              <li key={index} className="favorite-player-item">
                {/* Use Link to navigate to the UserStats or MatchHistory page */}
                <Link to={`/match-history/${summonerName}/${tagLine}`} className="favorite-player-link">
                  {summonerName}#{tagLine}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-favorites-message">You have no favorite players yet.</p>
      )}
    </div>
  );
};

export default FavoriteFeed;