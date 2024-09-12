import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserStats.css';

const UserStats = ({ riotId }) => {
  const [userStats, setUserStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const [gameName, tagLine] = riotId.split('#');
        console.log('gameName:', gameName, 'tagLine:', tagLine); // Showing gameName and tagLine properly

        // GraphQL query to fetch the full user stats
        const graphqlQuery = `
          query getUserStats($gameName: String!, $tagLine: String!) {
            userStats(gameName: $gameName, tagLine: $tagLine) {
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
          variables: { gameName, tagLine }
        });

        console.log('GraphQL Response:', response.data);

        // Check if the data exists and update state
        if (response.data && response.data.data && response.data.data.userStats) {
          setUserStats(response.data.data.userStats);
        } else {
          setError('No user stats found');
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setError('Failed to fetch user stats');
      }
    };

    // Trigger the data fetching on component mount or riotId change
    fetchUserStats();
  }, [riotId]);

  // Handle loading and error states
  if (error) {
    return <div className="user-stats-container">{error}</div>;
  }

  if (!userStats) {
    return <div className="user-stats-container">Loading user stats...</div>;
  }

  // Display the fetched user stats
  return (
    <div className="user-stats-container">
      <div className="user-profile">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/profileicon/${userStats.profileIconId}.png`}
          alt="Profile Icon"
        />
        <h2>{riotId.split('#')[0]}#{riotId.split('#')[1]}</h2>
        <p>Summoner Level: {userStats.summonerLevel}</p>
      </div>

      <div className="rank-info">
        <h3>Ranked</h3>
        {userStats.leagueInfo.map((league, index) => (
          <div key={index} className="rank-info-item">
            <p>{league.queueType.replace(/_/g, ' ')}</p>
            <img
              className="rank-icon"
              src={`/public/rankedEmblems/rank=${league.tier}.png`}
              alt="tier"
              width="50"
              height="50"
            />
            <p>{league.tier} {league.rank}</p>
            <p>{league.leaguePoints} LP</p>
            <p>{league.wins}W / {league.losses}L</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStats;