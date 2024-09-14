import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Import the CSS file

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          '/graphql',
          {
            query: `
              query getUser {
                getUser {
                  username
                  email
                  favoritePlayers
                }
              }
            `,
          },
          { withCredentials: true }
        );

        setUserData(response.data.data.getUser);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to fetch profile data. Please try again.');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!userData) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      <p className="profile-info">
        <strong>Username:</strong> {userData.username}
      </p>
      <p className="profile-info">
        <strong>Email:</strong> {userData.email}
      </p>
      <h3 className="favorite-players-title">Favorite Players</h3>
      {userData.favoritePlayers.length > 0 ? (
        <ul className="favorite-players-list">
          {userData.favoritePlayers.map((player) => (
            <li key={player} className="favorite-player-item">{player}</li>
          ))}
        </ul>
      ) : (
        <p className="no-favorites-message">No favorite players added yet.</p>
      )}
    </div>
  );
};

export default Profile;