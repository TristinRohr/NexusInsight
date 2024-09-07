const MatchHistory = ({ matchHistory }) => {
  return (
    <div>
    <h2>Match History</h2>
    <div className="flex-container">
      {matchHistory.map((match, index) => (
        <div key={index} className="match-card">
          <div className="match-summary">
            <p><strong>Champion:</strong> {match.championName}</p>
            <img src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${match.championName}.png`} alt={match.championName} />
            <p><strong>Win:</strong> {match.win ? 'Yes' : 'No'}</p>
            <p><strong>K/D/A:</strong> {match.kills}/{match.deaths}/{match.assists}</p>
          </div>
          <div className="match-details">
            <p><strong>Gold Earned:</strong> {match.goldEarned}</p>
            <p><strong>Total Damage Dealt:</strong> {match.totalDamageDealt}</p>
            <p><strong>Wards Placed:</strong> {match.wardsPlaced}</p>
            <h4>Participants</h4>
            {match.participants.map((participant, idx) => (
              <div key={idx} className={`participant ${participant.puuid === match.puuid ? 'highlight' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{participant.championName}</span>
                  <img src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${participant.championName}.png`} alt={participant.championName} style={{ marginLeft: '10px' }} />
                </div>
                <div>
                  <p><strong>K/D/A:</strong> {participant.kills}/{participant.deaths}/{participant.assists}</p>
                  <p><strong>Gold Earned:</strong> {participant.goldEarned}</p>
                  <p><strong>Total Damage Dealt:</strong> {participant.totalDamageDealt}</p>
                  <p><strong>Wards Placed:</strong> {participant.wardsPlaced}</p>
                  <div>
                    <h4>Items</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {participant.items.map((item, itemIdx) => (
                        item !== 0 && (
                          <img
                            key={itemIdx}
                            src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/item/${item}.png`}
                            alt={`Item ${item}`}
                            style={{ width: '32px', height: '32px', margin: '2px' }}
                          />
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
export default MatchHistory;