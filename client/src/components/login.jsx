import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [summonerName, setSummonerName] = useState('');
  const [tagLine, setTagLine] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (summonerName && tagLine) {
      // Pass the summonerName and tagLine back to the App component
      onLogin(summonerName, tagLine);
    }
  };

  return (
    <div>
      <h2>Enter your Summoner Info</h2>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;