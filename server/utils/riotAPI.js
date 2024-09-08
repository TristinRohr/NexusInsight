// riotApiService.js
const fetch = require('node-fetch');
require('dotenv').config();

const RIOT_API_KEY = process.env.RIOT_API_KEY;

exports.fetchPuuidByRiotId = async (gameName, tagLine) => {
  console.log(`Fetching PUUID for Riot ID: ${gameName}#${tagLine}`);
  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${RIOT_API_KEY}`;
  console.log(`Request URL: ${url}`);

  const response = await fetch(url);
  const responseBody = await response.text();

  if (!response.ok) {
    console.error('Failed to fetch PUUID by Riot ID', response.status, responseBody);
    throw new Error('Failed to fetch PUUID by Riot ID');
  }

  const data = JSON.parse(responseBody);
  console.log('Fetched PUUID:', data.puuid);
  return data.puuid;
};

exports.fetchUserStats = async (puuid) => {
  console.log(`Fetching user stats for PUUID: ${puuid}`);
  const url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`;
  console.log(`Request URL: ${url}`);

  const response = await fetch(url);
  const responseBody = await response.text();

  if (!response.ok) {
    console.error('Failed to fetch user stats', response.status, responseBody);
    throw new Error('Failed to fetch user stats');
  }

  const data = JSON.parse(responseBody);
  console.log('Fetched user stats:', data);
  return data;
};

exports.fetchMatchHistory = async (puuid) => {
  console.log(`Fetching match history for PUUID: ${puuid}`);
  const url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${RIOT_API_KEY}`;
  console.log(`Request URL: ${url}`);

  const response = await fetch(url);
  const responseBody = await response.text();

  if (!response.ok) {
    console.error('Failed to fetch match history', response.status, responseBody);
    throw new Error('Failed to fetch match history');
  }

  const data = JSON.parse(responseBody);
  console.log('Fetched match history:', data);
  return data;
};

exports.fetchMatchDetails = async (matchId) => {
  console.log(`Fetching match details for match ID: ${matchId}`);
  const url = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`;
  console.log(`Request URL: ${url}`);

  const response = await fetch(url);
  const responseBody = await response.text();

  if (!response.ok) {
    console.error('Failed to fetch match details', response.status, responseBody);
    throw new Error('Failed to fetch match details');
  }

  const data = JSON.parse(responseBody);

  const match = {
    metadata: data.metadata,
    info: {
      ...data.info,
      participants: data.info.participants.map(participant => ({
        puuid: participant.puuid,
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
          participant.item6
        ]
      }))
    }
  };
  console.log('Fetched match details:', match);
  return match;
};

exports.fetchLiveMatchData = async (puuid) => {
  console.log(`Fetching live match data for PUUID: ${puuid}`);
  const url = `https://na1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}?api_key=${RIOT_API_KEY}`;
  console.log(`Request URL: ${url}`);

  const response = await fetch(url);
  const responseBody = await response.text();

  if (!response.ok) {
    console.error('Failed to fetch live match data', response.status, responseBody);
    throw new Error('Failed to fetch live match data');
  }

  const data = JSON.parse(responseBody);
  console.log('Fetched live match data:', data);
  return data;
};