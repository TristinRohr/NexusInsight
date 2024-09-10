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

        const graphqlQuery = `
          query getUserStats($gameName: String!, $tagLine: String!) {
            userStats(gameName: $gameName, tagLine: $tagLine) {
              name
              summonerLevel
              profileIconId
            }
          }
        `;

        const response = await axios.post('/graphql', {
          query: graphqlQuery,
          variables: { gameName, tagLine }
        });

        setUserStats(response.data.data.userStats);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setError('Failed to fetch user stats');
      }
    };

    fetchUserStats();
  }, [riotId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userStats) {
    return <div>Loading user stats...</div>;
    
  }

  return (
    <div>
      <h2>{userStats.name}</h2>
      <p>Level: {userStats.summonerLevel}</p>
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/profileicon/${userStats.profileIconId}.png`}
        alt="Profile Icon"
      />
    </div>
  );
};

export default UserStats;
