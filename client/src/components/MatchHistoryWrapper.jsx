import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import UserStats from './UserStats.jsx'; // Assuming you have a UserStats component
import MatchHistory from './MatchHistory'; // MatchHistory component


const MatchHistoryWrapper = () => {
  const { summonerName, tagLine } = useParams();

  // State to hold the search term
  const [searchTerm, setSearchTerm] = useState('');

  if (!summonerName || !tagLine) {
    return <div>User not found or invalid parameters.</div>;
  }

  // Pass the riotId constructed from summonerName and tagLine to both components
  const riotId = `${summonerName}#${tagLine}`;

  return (
    <div>
      {/* Render UserStats component */}
      <UserStats riotId={riotId} setSearchTerm={setSearchTerm}/>

      {/* Render MatchHistory component with setSearchTerm */}
      <MatchHistory riotId={riotId} setSearchTerm={setSearchTerm} />
    </div>
  );
};

export default MatchHistoryWrapper;