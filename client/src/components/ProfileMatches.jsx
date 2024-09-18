import React from "react";
import UserStats from "./UserStats";
import MatchHistory from "./MatchHistory";

const ProfileMatchHistory = ({ gameName, tagLine }) => {
  const riotId = `${gameName}#${tagLine}`;

  return (
    <div>
      <h2>Match History for {gameName}#{tagLine}</h2>
      {/* Render User Stats and Match History using the passed gameName and tagLine */}
      <UserStats riotId={riotId} />
      <MatchHistory riotId={riotId} />
    </div>
  );
};

export default ProfileMatchHistory;