const riotApiService = require('../utils/riotAPI');
const axios = require('axios');

const riotResolvers = {
  Query: {
    // Existing matchHistory resolver
    matchHistory: async (_, { gameName, tagLine }) => {
      try {
        const puuid = await riotApiService.fetchPuuidByRiotId(gameName, tagLine);
        const matchIds = await riotApiService.fetchMatchHistory(puuid);

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

    // New userStats resolver
    userStats: async (_, { gameName, tagLine }) => {
      try {
        console.log(`Resolving UserStats for Riot ID: ${gameName}#${tagLine}`);

        // Step 1: Fetch PUUID using the provided function
        const puuid = await riotApiService.fetchPuuidByRiotId(gameName, tagLine);

        // Step 2: Use PUUID to fetch summoner data from Riot API
        const summonerUrl = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${process.env.RIOT_API_KEY}`;
        const summonerResponse = await axios.get(summonerUrl);
        const summonerData = summonerResponse.data;

        console.log('Fetched Summoner Data:', summonerData);

        // Step 3: Return the data in the format of UserStats type
        return {
          id: summonerData.id,
          accountId: summonerData.accountId,
          puuid: summonerData.puuid,
          name: summonerData.name,
          summonerLevel: summonerData.summonerLevel,
          profileIconId: summonerData.profileIconId
        };
      } catch (error) {
        console.error('Error fetching user stats:', error.message);
        throw new Error('Failed to fetch user stats');
      }
    }
  },
};

module.exports = riotResolvers;