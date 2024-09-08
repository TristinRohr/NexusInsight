import React, { useState } from 'react';
import UserStats from './components/UserStats';
import MatchHistory from './components/MatchHistory';
import LiveMatch from './components/LiveMatch';
import Login from './components/Login';

const App = () => {
  const [summonerName, setSummonerName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (name, tag) => {
    setSummonerName(name);
    setTagLine(tag);
    setIsLoggedIn(true);
  };

  return (
    <div>
      <h1>League of Legends Tracker</h1>
      {isLoggedIn ? (
        <div>
          {/* Pass the summonerName and tagLine to the individual components */}
          <UserStats riotId={`${summonerName}#${tagLine}`} />
          <MatchHistory riotId={`${summonerName}#${tagLine}`} />
          <LiveMatch riotId={`${summonerName}#${tagLine}`} />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;