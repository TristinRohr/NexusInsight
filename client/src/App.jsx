import React, { useState } from 'react';
import Login from './components/Login';
import UserStats from './components/UserStats';

function App() {
  const [riotId, setRiotId] = useState(null);

  return (
    <div className="App">
      {!riotId ? (
        <Login setRiotId={setRiotId} />
      ) : (
        <UserStats riotId={riotId} />
       
      )}
    </div>
  );
}

export default App;