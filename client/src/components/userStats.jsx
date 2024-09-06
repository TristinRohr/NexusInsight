import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserStats.css';  // Import the CSS file
import MatchHistory from './MatchHistory';
import LiveMatch from './LiveMatch';

const UserStats = ({ riotId }) => {
  const [userStats, setUserStats] = useState(null);
  const [matchHistory, setMatchHistory] = useState(null);
  const [liveMatch, setLiveMatch] = useState(null);
  const [error, setError] = useState(null);
  const [liveMatchError, setLiveMatchError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [gameName, tagLine] = riotId.split('#');

        // Fetch user stats
        const statsResponse = await axios.get(`http://localhost:3001/api/user-stats/${gameName}/${tagLine}`);
        setUserStats(statsResponse.data);

        // Fetch match history
        const matchHistoryResponse = await axios.get(`http://localhost:3001/api/match-history/${gameName}/${tagLine}`);
        setMatchHistory(matchHistoryResponse.data);

        // Fetch live match data
        try {
          const liveMatchResponse = await axios.get(`http://localhost:3001/api/live-match/${gameName}/${tagLine}`);
          setLiveMatch(liveMatchResponse.data);
        } catch (liveMatchError) {
          if (liveMatchError.response && liveMatchError.response.status === 404) {
            setLiveMatchError('No live match found');
          } else {
            throw liveMatchError;
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      }
    };

    fetchStats();
  }, [riotId]);

  if (error) return <div>{error}</div>;
  if (!userStats || !matchHistory) return <div>Loading...</div>;

  const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/profileicon/${userStats.profileIconId}.png`;

  return (
    <div className="user-stats">
      <h2>User Stats</h2>
      <img src={profileIconUrl} alt="Profile Icon" style={{ width: '50px', height: '50px' }} />
      <p>Name: {userStats.name}</p>
      <p>Summoner Level: {userStats.summonerLevel}</p>
      <p>Game Name and Tagline: {riotId}</p>
      <MatchHistory matchHistory={matchHistory} />
      <LiveMatch liveMatch={liveMatch} liveMatchError={liveMatchError} />
    </div>
  );
};

export default UserStats;
