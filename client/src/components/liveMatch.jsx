const LiveMatch = ({ liveMatch, liveMatchError }) => {
    return (
      <div>
         <h2>Live Match</h2>
        {liveMatchError ? (
          <div>{liveMatchError}</div>
        ) : (
          liveMatch && (
            <div className="live-match">
              <p><strong>Game Mode:</strong> {liveMatch.gameData.gameMode}</p>
              <p><strong>Game Time:</strong> {liveMatch.gameData.gameTime}</p>
              <p><strong>Map Name:</strong> {liveMatch.gameData.mapName}</p>
              <div className="live-match-details">
                <div>
                  <h3>Active Player</h3>
                  <p>Summoner Name: {liveMatch.activePlayer.summonerName}</p>
                  <p>Level: {liveMatch.activePlayer.level}</p>
                  <p>Current Gold: {liveMatch.activePlayer.currentGold}</p>
                  <p>Current Health: {liveMatch.activePlayer.championStats.currentHealth}</p>
                  <p>Max Health: {liveMatch.activePlayer.championStats.maxHealth}</p>
                  <p>Ability Power: {liveMatch.activePlayer.championStats.abilityPower}</p>
                  <p>Attack Damage: {liveMatch.activePlayer.championStats.attackDamage}</p>
                  <p>Armor: {liveMatch.activePlayer.championStats.armor}</p>
                  <p>Magic Resist: {liveMatch.activePlayer.championStats.magicResist}</p>
                  <p>Move Speed: {liveMatch.activePlayer.championStats.moveSpeed}</p>
                  <div>
                    <h4>Abilities</h4>
                    {Object.entries(liveMatch.activePlayer.abilities).map(([key, ability], idx) => (
                      <div key={idx}>
                        <p>{key}: {ability.displayName} (Level: {ability.abilityLevel})</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-container">
                  <h3>All Players</h3>
                  {liveMatch.allPlayers.map((player, idx) => (
                    <div key={idx} className="player-card">
                      <p>Player: {player.summonerName}</p>
                      <p>Champion: {player.championName}</p>
                      <p>Level: {player.level}</p>
                      <p>Kills: {player.scores.kills}</p>
                      <p>Deaths: {player.scores.deaths}</p>
                      <p>Assists: {player.scores.assists}</p>
                      <p>CS: {player.scores.creepScore}</p>
                      <div>
                        <h4>Items</h4>
                        {player.items.map((item, itemIdx) => (
                          <img
                            key={itemIdx}
                            src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/item/${item.itemID}.png`}
                            alt={`Item ${item.itemID}`}
                            style={{ width: '32px', height: '32px', margin: '2px' }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="event-details">
                  <h3>Events</h3>
                  {liveMatch.events.Events.map((event, idx) => (
                    <div key={idx} className="event-card">
                      <p><strong>Event Name:</strong> {event.EventName}</p>
                      <p><strong>Event Time:</strong> {event.EventTime}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    );
  }
  
  export default LiveMatch;