import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); // Track error state

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
          { withCredentials: true } // Send cookies automatically
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
    return <div>{error}</div>; // Display the error message if any
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <h3>Favorite Players</h3>
      {userData.favoritePlayers.length > 0 ? (
        <ul>
          {userData.favoritePlayers.map((player) => (
            <li key={player}>{player}</li>
          ))}
        </ul>
      ) : (
        <p>No favorite players added yet.</p>
      )}
    </div>
  );
};

export default Profile;
