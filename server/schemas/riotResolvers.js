// server/schemas/riotResolvers.js
const riotApiService = require('../utils/riotAPI');

const riotResolvers = {
  Query: {
    userStats: async (_, { gameName, tagLine }) => {
      try {
        const puuid = await riotApiService.fetchPuuidByRiotId(gameName, tagLine);
        const userStats = await riotApiService.fetchUserStats(puuid);
        return userStats;
      } catch (error) {
        console.error('Error in userStats resolver:', error);
        throw new Error('Failed to fetch user stats');
      }
    },
    matchHistory: async (_, { gameName, tagLine }) => {
      try {
        const puuid = await riotApiService.fetchPuuidByRiotId(gameName, tagLine);
        const matchHistory = await riotApiService.fetchMatchHistory(puuid);
        return matchHistory;
      } catch (error) {
        console.error('Error in matchHistory resolver:', error);
        throw new Error('Failed to fetch match history');
      }
    },
    matchDetails: async (_, { matchId }) => {
      try {
        const matchDetails = await riotApiService.fetchMatchDetails(matchId);
        return matchDetails;
      } catch (error) {
        console.error('Error in matchDetails resolver:', error);
        throw new Error('Failed to fetch match details');
      }
    },
    liveMatch: async (_, { gameName, tagLine }) => {
      try {
        const puuid = await riotApiService.fetchPuuidByRiotId(gameName, tagLine);
        const liveMatchData = await riotApiService.fetchLiveMatchData(puuid);
        return liveMatchData;
      } catch (error) {
        if (error.message.includes('404')) {
          console.log('No live match found');
          return null;
        }
        console.error('Error in liveMatch resolver:', error);
        throw new Error('Failed to fetch live match data');
      }
    }
  }
};

module.exports = riotResolvers;