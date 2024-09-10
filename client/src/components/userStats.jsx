import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserStats.css';

const UserStats = ({ riotId, summonerName, tagLine }) => {
  const [userStats, setUserStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const [gameName, tagLine] = riotId.split('#');
        console.log('gameName:', gameName, 'tagLine:', tagLine);

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
            }
          }
        `;

        // Post request to the GraphQL API
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
    return <div>{error}</div>;
  }

  if (!userStats) {
    return <div>Loading user stats...</div>;
  }

  // Display the fetched user stats
  return (
    <div>
      <h2>Summoner Name: {summonerName}#{tagLine}</h2>
      <p>Summoner Level: {userStats.summonerLevel}</p>
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/profileicon/${userStats.profileIconId}.png`}
        alt="Profile Icon"
      />
    </div>
  );
};

export default UserStats;