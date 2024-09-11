import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Feed = () => {
  const [feedData, setFeedData] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        // Fetch the feed data for favorite players' activities
        const response = await axios.post('/graphql', {
          query: `
            query getUser {
              getUser {
                favoritePlayers
              }
            }
          `,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const favoritePlayers = response.data.data.getUser.favoritePlayers;

        const playerFeeds = await Promise.all(
          favoritePlayers.map(async (playerName) => {
            // Mock fetching player match history
            const matchHistoryResponse = await axios.post('/graphql', {
              query: `
                query getMatchHistory($gameName: String!, $tagLine: String!) {
                  matchHistory(gameName: $gameName, tagLine: $tagLine) {
                    matchId
                    champion
                    kills
                    deaths
                    assists
                  }
                }
              `,
              variables: { gameName: playerName.split('#')[0], tagLine: playerName.split('#')[1] },
            });
            return matchHistoryResponse.data.data.matchHistory;
          })
        );

        setFeedData(playerFeeds.flat());
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div>
      <h2>Favorite Players' Activity Feed</h2>
      {feedData.length === 0 ? (
        <p>No recent activity</p>
      ) : (
        <ul>
          {feedData.map((match, index) => (
            <li key={index}>
              {match.champion} - {match.kills}/{match.deaths}/{match.assists}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Feed;
