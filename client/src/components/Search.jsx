import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = ({ onSearch }) => {
  const [summonerName, setSummonerName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (summonerName && tagLine) {
      onSearch(summonerName, tagLine);  // Pass summonerName and tagLine to App component
      navigate('/match-history');       // Navigate to the match history page after search
    }
  };

  return (
    <div>
      <h2>Enter Summoner Info</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Summoner Name:</label>
          <input
            type="text"
            value={summonerName}
            onChange={(e) => setSummonerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tag Line:</label>
          <input
            type="text"
            value={tagLine}
            onChange={(e) => setTagLine(e.target.value)}
            required
          />
        </div>
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;
