import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Import the CSS file
import FavoriteList from './FavoriteList'; // Import the FavoriteList component

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
      <FavoriteList />
    </div>
  );
};

export default Profile;