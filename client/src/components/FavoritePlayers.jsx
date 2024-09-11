import React, { useState } from 'react';
import axios from 'axios';

const FavoritePlayers = () => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/graphql', {
        query: `
          mutation AddFavoritePlayer($playerName: String!) {
            addFavoritePlayer(playerName: $playerName) {
              favoritePlayers
            }
          }
        `,
        variables: { playerName },
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlayerName('');
    } catch (error) {
      setError('Failed to add favorite player.');
    }
  };

  return (
    <div>
      <h2>Add Favorite Player</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
          required
        />
        <button type="submit">Add Player</button>
      </form>
    </div>
  );
};

export default FavoritePlayers;
