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
  console.log('Fetched match IDs:', data);
  return data;  // Returning array of match IDs
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
  console.log('Fetched match details:', data);
  return data;  // Return the detailed match data
};
