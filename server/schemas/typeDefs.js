const { gql } = require("apollo-server-express");

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
    items: [Int]  # Items are integers here for match history
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

  type Ability {
    abilityLevel: Int
    displayName: String
    id: String
    rawDescription: String
    rawDisplayName: String
  }

  type Abilities {
    Q: Ability
    W: Ability
    E: Ability
    R: Ability
    Passive: Ability
  }

  type ChampionStats {
    abilityHaste: Float
    abilityPower: Float
    armor: Float
    armorPenetrationFlat: Float
    armorPenetrationPercent: Float
    attackDamage: Float
    attackRange: Float
    attackSpeed: Float
    bonusArmorPenetrationPercent: Float
    bonusMagicPenetrationPercent: Float
    critChance: Float
    critDamage: Float
    currentHealth: Float
    healShieldPower: Float
    healthRegenRate: Float
    lifeSteal: Float
    magicLethality: Float
    magicPenetrationFlat: Float
    magicPenetrationPercent: Float
    magicResist: Float
    maxHealth: Float
    moveSpeed: Float
    omnivamp: Float
    physicalLethality: Float
    physicalVamp: Float
    resourceMax: Float
    resourceRegenRate: Float
    resourceType: String
    resourceValue: Float
    spellVamp: Float
    tenacity: Float
  }

  type Rune {
    displayName: String
    id: Int
    rawDescription: String
    rawDisplayName: String
  }

  type FullRunes {
    generalRunes: [Rune]
    keystone: Rune
    primaryRuneTree: Rune
    secondaryRuneTree: Rune
    statRunes: [Rune]
  }

  type ActivePlayer {
    abilities: Abilities
    championStats: ChampionStats
    currentGold: Float
    fullRunes: FullRunes
    level: Int
    riotId: String
    riotIdGameName: String
    riotIdTagLine: String
    summonerName: String
    teamRelativeColors: Boolean
  }

  type SummonerSpell {
    displayName: String
    rawDescription: String
    rawDisplayName: String
  }

  type SummonerSpells {
    summonerSpellOne: SummonerSpell
    summonerSpellTwo: SummonerSpell
  }

  type Scores {
    assists: Int
    creepScore: Int
    deaths: Int
    kills: Int
    wardScore: Float
  }

  type Runes {
    keystone: Rune
    primaryRuneTree: Rune
    secondaryRuneTree: Rune
  }

  type LiveGameItem {
    displayName: String
    itemID: Int
    price: Int
  }

  type AllPlayer {
    championName: String
    isBot: Boolean
    isDead: Boolean
    items: [LiveGameItem] # Items for live game are objects, not integers
    level: Int
    position: String
    rawChampionName: String
    rawSkinName: String
    respawnTimer: Float
    riotId: String
    riotIdGameName: String
    riotIdTagLine: String
    runes: Runes
    scores: Scores
    skinID: Int
    summonerName: String
    summonerSpells: SummonerSpells
    team: String
  }

  type Event {
    EventID: Int
    EventName: String
    EventTime: Float
  }

  type Events {
    Events: [Event]
  }

  type GameData {
    gameMode: String
    gameTime: Float
    mapName: String
    mapNumber: Int
    mapTerrain: String
  }

  type LiveClientData {
    activePlayer: ActivePlayer
    allPlayers: [AllPlayer]
    events: Events
    gameData: GameData
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

  # Updated to add getLiveClientData query
  type Query {
    userStats(gameName: String!, tagLine: String!): UserStats
    matchHistory(gameName: String!, tagLine: String!): [MatchHistory]
    matchDetails(matchId: String!): MatchDetails
    liveMatch(gameName: String!, tagLine: String!): LiveMatch
    getLiveClientData: LiveClientData  # <-- Added this line for live data
    getUser: User
    queueType(queueId: Int!): QueueType
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      gameName: String!
      tagLine: String!
    ): String
    login(email: String!, password: String!): String
    updateUser(input: UpdateUserInput!): User
    addFavoritePlayer(summonerName: String!, tagLine: String!): User
    removeFavoritePlayer(summonerName: String!, tagLine: String!): User
    logout: Boolean
    checkout(amount: Int!): CheckoutSession!
  }
`;

module.exports = typeDefs;