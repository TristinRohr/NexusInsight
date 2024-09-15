import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserStats.css';

// UserStats component to fetch and display user stats
const UserStats = ({ riotId }) => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [summonerName, tagLine] = riotId.split('#'); // Correct summonerName and tagLine

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        // GraphQL query to fetch user stats
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

        const response = await axios.post('/graphql', {
          query: graphqlQuery,
          variables: { summonerName, tagLine }
        });

        if (response.data && response.data.data && response.data.data.userStats) {
          setUserStats(response.data.data.userStats);
        } else {
          setError('No user stats found');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setError('Failed to fetch user stats');
        setLoading(false);
      }
    };

    fetchUserStats();

    // Check if the user is already in favorites
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.includes(riotId));
  }, [riotId]);

  const handleToggleFavorite = async () => {
    try {
      let mutation = '';
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

      const response = await axios.post('/graphql', {
        query: mutation,
        variables: { summonerName, tagLine },
      });

      // Update the favorite status based on the response
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
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
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/profileicon/${userStats.profileIconId}.png`}
          alt="Profile Icon"
        />
        <h2>{riotId.split('#')[0]}#{riotId.split('#')[1]}</h2>
        <p>Summoner Level: {userStats.summonerLevel}</p>
        <div className="favorite-toggle">
          <button onClick={handleToggleFavorite}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>

      <div className="rank-info">
        <h3>Ranked</h3>
        {userStats.leagueInfo.length > 0 ? (
          userStats.leagueInfo.map((league, index) => (
            <div key={index} className="rank-info-item">
              <p>{league.queueType.replace(/_/g, ' ')}</p>
              <img
                className="rank-icon"
                src={`/rankedEmblems/rank=${league.tier}.png`}
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
  );
};

export default UserStats;