const fetch = require('node-fetch');
require('dotenv').config();
let intervalId;

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const GAME_CLIENT_API_URL = 'https://127.0.0.1:2999';

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

exports.fetchUserStats = async (gameName, tagLine) => {
  try {
    console.log(`Fetching user stats for ${gameName}#${tagLine}`);

    // Step 1: Call the separate function to fetch PUUID by Riot ID
    const puuid = await fetchPuuidByRiotId(gameName, tagLine);
    console.log(`PUUID fetched: ${puuid}`);

    // Step 2: Fetch Summoner Data by PUUID
    const summonerUrl = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`;
    console.log(`Summoner Request URL: ${summonerUrl}`);

    const summonerResponse = await fetch(summonerUrl);
    const summonerData = await summonerResponse.json();

    if (!summonerResponse.ok) {
      console.error('Failed to fetch summoner stats', summonerResponse.status, summonerData);
      throw new Error('Failed to fetch summoner stats');
    }

    console.log('Fetched Summoner Stats:', summonerData);

    const { id, name, summonerLevel, profileIconId } = summonerData;

    // Step 3: Use the summoner ID to fetch league information
    const leagueUrl = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${RIOT_API_KEY}`;
    console.log(`League Request URL: ${leagueUrl}`);

    const leagueResponse = await fetch(leagueUrl);
    const leagueData = await leagueResponse.json();

    if (!leagueResponse.ok) {
      console.error('Failed to fetch league data', leagueResponse.status, leagueData);
      throw new Error('Failed to fetch league data');
    }

    console.log('Fetched League Data:', leagueData);

    // Step 4: Return the combined data
    return {
      name,
      summonerLevel,
      profileIconId,
      leagueInfo: leagueData,  // This will include the league information retrieved
    };

  } catch (error) {
    console.error('Error fetching user stats or league data:', error);
    throw new Error('Failed to fetch user stats or league data');
  }
};

exports.queueTypes = async () => {
  console.log(`Fetching queue types from static JSON`);
  const url = `https://static.developer.riotgames.com/docs/lol/queues.json`;

  const response = await fetch(url);
  const data = await response.json(); // Make sure this is parsed as an array

  
  return data; // Return the full list of queues
};

exports.fetchLiveGameData = async () => {
  try {
    const url = 'https://127.0.0.1:2999/liveclientdata/allgamedata';

    // Create an HTTPS agent that bypasses SSL certificate validation
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Ignore self-signed certificate
    });

    // Make the GET request with the HTTPS agent
    const response = await axios.get(url, { httpsAgent });

    console.log('Fetched live game data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching live game data:', error.response?.data || error.message);
    throw error;
  }
};
