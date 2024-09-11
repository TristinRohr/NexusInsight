import React, { useState } from 'react';

const Login = ({ setRiotId }) => {
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setRiotId(`${gameName}#${tagLine}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Game Name"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tag Line"
        value={tagLine}
        onChange={(e) => setTagLine(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;