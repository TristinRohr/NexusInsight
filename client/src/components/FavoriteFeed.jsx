import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FavoriteFeed = () => {
  const [summonerName, setSummonerName] = useState('');
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [feedData, setFeedData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch feed when the favorite players change
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        if (favoritePlayers.length === 0) return; // Exit if no favorites

        const feedPromises = favoritePlayers.map(async (player) => {
          // Fetch recent match history for each favorite player
          const response = await axios.post('/graphql', {
            query: `
              query getMatchHistory($gameName: String!) {
                matchHistory(gameName: $gameName) {
                  matchId
                  champion
                  kills
                  deaths
                  assists
                  gameDuration
                  participants {
                    summonerName
                  }
                }
              }
            `,
            variables: { gameName: player },
          });
          return { player, matches: response.data.data.matchHistory };
        });

        const feedResults = await Promise.all(feedPromises);
        setFeedData(feedResults);
      } catch (error) {
        console.error('Error fetching feed:', error);
        setError('Failed to fetch feed');
      }
    };

    fetchFeed();
  }, [favoritePlayers]);

  // Add a summoner to the favorites list
  const addFavoritePlayer = () => {
    if (summonerName) {
      setFavoritePlayers([...favoritePlayers, summonerName]);
      setSummonerName(''); // Clear input after adding
    }
  };

  return (
    <div>
      <h2>Favorite Players Feed</h2>
      {error && <p>{error}</p>}

      {/* Add favorite summoner */}
      <div>
        <input
          type="text"
          placeholder="Summoner Name"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
        />
        <button onClick={addFavoritePlayer}>Add Favorite</button>
      </div>

      {/* Display favorite players */}
      {favoritePlayers.length > 0 && (
        <div>
          <h3>Your Favorite Players</h3>
          <ul>
            {favoritePlayers.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display feed */}
      {feedData.length > 0 && (
        <div>
          <h3>Recent Matches</h3>
          {feedData.map((feedItem, index) => (
            <div key={index}>
              <h4>{feedItem.player}'s Recent Matches</h4>
              <ul>
                {feedItem.matches.map((match, mIndex) => (
                  <li key={mIndex}>
                    Champion: {match.champion} | K/D/A: {match.kills}/{match.deaths}/{match.assists} | Duration: {Math.floor(match.gameDuration / 60)} minutes
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteFeed;
