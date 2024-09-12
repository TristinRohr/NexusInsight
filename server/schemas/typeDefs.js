const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type UserStats {
    id: String
    accountId: String
    puuid: String
    name: String
    summonerLevel: Int
    profileIconId: Int
    leagueInfo: [LeagueEntry]
  }

  type LeagueEntry {
    queueType: String
    tier: String
    rank: String
    leaguePoints: Int
    wins: Int
    losses: Int
  }

  type MatchHistory {
    matchId: String
    gameStartTimestamp: Float
    gameDuration: Int
    champion: String
    kills: Int
    deaths: Int
    assists: Int
    participants: [Participant]
    teams: [Team]
    queueId: Int
    queueType: [QueueType]
  }

  type QueueType {
    queueId: Int,
    map: String,
    description: String,
    notes: String
  }

  type Team {
    teamId: Int,
    win: Boolean
  }

  type LiveMatch {
    gameId: String
    participants: [Participant]
    gameMode: String
    mapId: Int
  }

  type Participant {
    summonerName: String
    riotIdTagline: String
    championName: String
    kills: Int
    deaths: Int
    assists: Int
    goldEarned: Int
    totalDamageDealtToChampions: Int
    wardsPlaced: Int
    items: [Int]
    teamId: Int
  }

  type MatchDetails {
    metadata: Metadata
    info: MatchInfo
  }

  type Metadata {
    matchId: String
  }

  type MatchInfo {
    participants: [Participant]
    gameDuration: Int
    gameMode: String
  }

  type User {
    _id: ID
    username: String
    email: String
    favoritePlayers: [String]
  }

  type Query {
    userStats(gameName: String!, tagLine: String!): UserStats
    matchHistory(gameName: String!, tagLine: String!): [MatchHistory]
    matchDetails(matchId: String!): MatchDetails
    liveMatch(gameName: String!, tagLine: String!): LiveMatch
    getUser: User
    queueTypes(queueId: Int!): QueueType
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
    addFavoritePlayer(playerName: String!): User
  }
`;

module.exports = typeDefs;