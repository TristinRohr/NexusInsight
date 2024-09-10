const riotApiService = require('../utils/riotAPI');

const riotResolvers = {
  Query: {
    matchHistory: async (_, { gameName, tagLine }) => {
      try {
        console.log(`Fetching match history for ${gameName}#${tagLine}`);
        const puuid = await riotApiService.fetchPuuidByRiotId(gameName, tagLine);
        console.log(`Fetched PUUID: ${puuid}`);
        
        const matchIds = await riotApiService.fetchMatchHistory(puuid);
        console.log('Fetched match IDs:', matchIds);
        
        // Fetch detailed match information for each match ID
        const matchDetailsPromises = matchIds.map(async (matchId) => {
          const matchDetails = await riotApiService.fetchMatchDetails(matchId);
          
          if (!matchDetails || !matchDetails.info) {
            console.error(`Failed to fetch match details for match ID: ${matchId}`);
            return {
              matchId: null,
              champion: null,
              kills: null,
              deaths: null,
              assists: null
            };
          }
          
          const userParticipant = matchDetails.info.participants.find(
            participant => participant.puuid === puuid
          );
          
          // If no participant data is found, handle the error
          if (!userParticipant) {
            console.error(`No participant found for PUUID: ${puuid} in match ID: ${matchId}`);
            return {
              matchId: matchId,
              champion: null,
              kills: null,
              deaths: null,
              assists: null
            };
          }
          
          return {
            matchId: matchId,
            champion: userParticipant.championName,
            kills: userParticipant.kills,
            deaths: userParticipant.deaths,
            assists: userParticipant.assists
          };
        });

        const matchDetails = await Promise.all(matchDetailsPromises);
        console.log('Fetched match details:', matchDetails);
        
        return matchDetails;
      } catch (error) {
        console.error('Error in matchHistory resolver:', error.message, error.stack);
        throw new Error('Failed to fetch match history');
      }
    },
  }
};

module.exports = riotResolvers;
