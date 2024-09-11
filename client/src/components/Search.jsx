import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [summonerName, setSummonerName] = useState('');
  const [tagLine, setTagLine] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (summonerName && tagLine) {
      onSearch(summonerName, tagLine);
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
