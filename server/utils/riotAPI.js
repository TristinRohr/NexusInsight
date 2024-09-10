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
