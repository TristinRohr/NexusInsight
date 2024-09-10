const riotApiService = require('../utils/riotAPI');

const riotResolvers = {
  Query: {
    matchHistory: async (_, { gameName, tagLine }) => {
      try {
        const puuid = await riotApiService.fetchPuuidByRiotId(gameName, tagLine);
        const matchIds = await riotApiService.fetchMatchHistory(puuid);

        // Fetch detailed match information for each match ID
        const matchDetailsPromises = matchIds.map(async (matchId) => {
          const matchDetails = await riotApiService.fetchMatchDetails(matchId);
          
          const userParticipant = matchDetails.info.participants.find(
            participant => participant.puuid === puuid
          );
          
          const participants = matchDetails.info.participants.map(participant => ({
            summonerName: participant.summonerName,
            championName: participant.championName,
            kills: participant.kills,
            deaths: participant.deaths,
            assists: participant.assists,
            goldEarned: participant.goldEarned,
            totalDamageDealt: participant.totalDamageDealt,
            wardsPlaced: participant.wardsPlaced,
            items: [
              participant.item0,
              participant.item1,
              participant.item2,
              participant.item3,
              participant.item4,
              participant.item5,
              participant.item6,
            ],
          }));

          return {
            matchId: matchDetails.metadata.matchId,
            gameStartTimestamp: matchDetails.info.gameStartTimestamp,
            gameDuration: matchDetails.info.gameDuration,
            champion: userParticipant ? userParticipant.championName : null,
            kills: userParticipant ? userParticipant.kills : null,
            deaths: userParticipant ? userParticipant.deaths : null,
            assists: userParticipant ? userParticipant.assists : null,
            participants
          };
        });

        const matchDetails = await Promise.all(matchDetailsPromises);
        return matchDetails;
      } catch (error) {
        console.error('Error in matchHistory resolver:', error.message);
        throw new Error('Failed to fetch match history');
      }
    },
  },
};

module.exports = riotResolvers;
