import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post('/graphql', {
          query: `
            query getUser {
              getUser {
                username
                email
                favoritePlayers
              }
            }
          `,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserData(response.data.data.getUser);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {userData.username}</p>
      <p>Email: {userData.email}</p>
      <h3>Favorite Players</h3>
      <ul>
        {userData.favoritePlayers.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
