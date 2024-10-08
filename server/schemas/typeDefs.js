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
    queueType: QueueType
  }

  type QueueType {
    queueId: Int
    map: String
    description: String
    notes: String
  }

  type Team {
    teamId: Int
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
    totalMinionsKilled: Int
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
    gameName: String
    tagLine: String
    favoritePlayers: [String]
  }

   input UpdateUserInput {
    username: String
    email: String
    gameName: String
    tagLine: String
  }

  type CheckoutSession {
    sessionId: String!
  }

  input ProductInput {
    name: String!
    description: String
    image: String
    price: Int!
    purchaseQuantity: Int!
  }

  type Query {
    userStats(gameName: String!, tagLine: String!): UserStats
    matchHistory(gameName: String!, tagLine: String!): [MatchHistory]
    matchDetails(matchId: String!): MatchDetails
    liveMatch(gameName: String!, tagLine: String!): LiveMatch
    getUser: User
    queueType(queueId: Int!): QueueType
  }

  type Mutation {
    register(username: String!, email: String!, password: String!, gameName: String!, tagLine: String!): String
    login(email: String!, password: String!): String
    updateUser(input: UpdateUserInput!): User
    addFavoritePlayer(summonerName: String!, tagLine: String!): User
    removeFavoritePlayer(summonerName: String!, tagLine: String!): User
    logout: Boolean
    checkout(amount: Int!): CheckoutSession!
  }
`;

module.exports = typeDefs;
