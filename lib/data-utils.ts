import teamsDataFutbol from "@/data/teams-futbol.json"
import teamsDataVoley from "@/data/teams-voley.json"
import teamsDataFutbolDamas from "@/data/teams-futbol-damas.json"
import teamsDataBasquet from "@/data/teams-basquet.json"

import fixturesDataFutbol from "@/data/fixtures-futbol.json"
import fixturesDataVoley from "@/data/fixtures-voley.json"
import fixturesDataFutbolDamas from "@/data/fixtures-futbol-damas.json"
import fixturesDataBasquet from "@/data/fixtures-basquet.json"

import standingsDataFutbol from "@/data/standings-futbol.json"
import standingsDataVoley from "@/data/standings-voley.json"
import standingsDataFutbolDamas from "@/data/standings-futbol-damas.json"
import standingsDataBasquet from "@/data/standings-basquet.json"
import { getSportById } from "@/lib/sports-utils"

// Reemplazar las funciones que usan require con funciones que usan los datos importados estáticamente
const getTeamsData = (sportId: string) => {
  switch (sportId) {
    case "futbol":
      return teamsDataFutbol
    case "voley":
      return teamsDataVoley
    case "futbol-damas":
      return teamsDataFutbolDamas
    case "basquet":
      return teamsDataBasquet
    default:
      return teamsDataFutbol
  }
}

const getFixturesData = (sportId: string) => {
  switch (sportId) {
    case "futbol":
      return fixturesDataFutbol
    case "voley":
      return fixturesDataVoley
    case "futbol-damas":
      return fixturesDataFutbolDamas
    case "basquet":
      return fixturesDataBasquet
    default:
      return fixturesDataFutbol
  }
}

const getStandingsData = (sportId: string) => {
  switch (sportId) {
    case "futbol":
      return standingsDataFutbol
    case "voley":
      return standingsDataVoley
    case "futbol-damas":
      return standingsDataFutbolDamas
    case "basquet":
      return standingsDataBasquet
    default:
      return standingsDataFutbol
  }
}

export type Team = {
  id: string
  name: string
  shortName: string
  logo: string
  stadium: string
  city: string
  group?: string
}

export type Match = {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  status: "upcoming" | "completed" | "postponed" | "live"
  date: string
  time: string
  venue: string
  group?: string
  description?: string
}

export type Round = {
  id: string
  name: string
  dateRange: string
  matches: Match[]
}

export type Standing = {
  teamId: string
  position: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor?: number
  goalsAgainst?: number
  goalDifference?: number
  setsFor?: number
  setsAgainst?: number
  setDifference?: number
  pointsFor?: number
  pointsAgainst?: number
  pointDifference?: number
  points: number
  status: "promotion" | "playoff" | "relegation" | "normal"
  group?: string
}

// Get all teams for a specific sport
export function getAllTeams(sportId = "futbol"): Team[] {
  const teamsData = getTeamsData(sportId)
  return teamsData.teams
}

// Get teams by group for a specific sport
export function getTeamsByGroup(group: string, sportId = "futbol"): Team[] {
  const teamsData = getTeamsData(sportId)
  return teamsData.teams.filter((team: Team) => team.group === group)
}

// Get team by ID for a specific sport
export function getTeamById(id: string, sportId = "futbol"): Team | undefined {
  const teamsData = getTeamsData(sportId)
  return teamsData.teams.find((team: Team) => team.id === id)
}

// Get all rounds with matches for a specific sport
export function getAllRounds(sportId = "futbol"): Round[] {
  const fixturesData = getFixturesData(sportId)
  return fixturesData.rounds
}

// Get group stage rounds for a specific sport
export function getGroupStageRounds(sportId = "futbol"): Round[] {
  const fixturesData = getFixturesData(sportId)
  const sport = getSportById(sportId)

  if (sport?.format === "groups") {
    return fixturesData.rounds.filter((round: Round) => !["semifinal", "final"].includes(round.id))
  } else {
    // Para formatos de todos contra todos, todas las rondas excepto la final
    return fixturesData.rounds.filter((round: Round) => round.id !== "final")
  }
}

// Get knockout stage rounds for a specific sport
export function getKnockoutStageRounds(sportId = "futbol"): Round[] {
  const fixturesData = getFixturesData(sportId)
  const sport = getSportById(sportId)

  if (sport?.format === "groups") {
    return fixturesData.rounds.filter((round: Round) => ["semifinal", "final"].includes(round.id))
  } else {
    // Para formatos de todos contra todos, solo la final
    return fixturesData.rounds.filter((round: Round) => round.id === "final")
  }
}

// Get round by ID for a specific sport
export function getRoundById(id: string, sportId = "futbol"): Round | undefined {
  const fixturesData = getFixturesData(sportId)
  return fixturesData.rounds.find((round: Round) => round.id === id)
}

// Get all matches for a specific sport
export function getAllMatches(sportId = "futbol"): Match[] {
  const fixturesData = getFixturesData(sportId)
  return fixturesData.rounds.flatMap((round: Round) => round.matches)
}

// Get matches by group for a specific sport
export function getMatchesByGroup(group: string, sportId = "futbol"): Match[] {
  return getAllMatches(sportId).filter((match: Match) => match.group === group)
}

// Get match by ID for a specific sport
export function getMatchById(id: string, sportId = "futbol"): Match | undefined {
  return getAllMatches(sportId).find((match: Match) => match.id === id)
}

// Get upcoming matches for a specific sport
export function getUpcomingMatches(limit?: number, sportId = "futbol"): Match[] {
  const matches = getAllMatches(sportId)
    .filter((match: Match) => match.status === "upcoming")
    .sort((a: Match, b: Match) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })

  return limit ? matches.slice(0, limit) : matches
}

// Get recent results for a specific sport
export function getRecentResults(limit?: number, sportId = "futbol"): Match[] {
  const matches = getAllMatches(sportId)
    .filter((match: Match) => match.status === "completed")
    .sort((a: Match, b: Match) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB.getTime() - dateA.getTime() // Most recent first
    })

  return limit ? matches.slice(0, limit) : matches
}

// Get matches by team ID for a specific sport
export function getMatchesByTeam(teamId: string, sportId = "futbol"): Match[] {
  return getAllMatches(sportId).filter((match: Match) => match.homeTeam === teamId || match.awayTeam === teamId)
}

// Get all standings for a specific sport
export function getAllStandings(sportId = "futbol"): Standing[] {
  const standingsData = getStandingsData(sportId)
  return standingsData.standings
}

// Get standings by group for a specific sport
export function getStandingsByGroup(group: string, sportId = "futbol"): Standing[] {
  const standingsData = getStandingsData(sportId)
  return standingsData.standings.filter((standing: Standing) => standing.group === group)
}

// Get enriched standings with team data for a specific sport
export function getEnrichedStandings(sportId = "futbol"): (Standing & { team: Team })[] {
  const standingsData = getStandingsData(sportId)
  return standingsData.standings.map((standing: Standing) => {
    const team = getTeamById(standing.teamId, sportId)
    if (!team) throw new Error(`Team with ID ${standing.teamId} not found`)
    return { ...standing, team }
  })
}

// Get enriched standings by group for a specific sport
export function getEnrichedStandingsByGroup(group: string, sportId = "futbol"): (Standing & { team: Team })[] {
  const standingsData = getStandingsData(sportId)
  const groupStandings = standingsData.standings.filter((standing: Standing) => standing.group === group)

  return groupStandings.map((standing: Standing) => {
    const team = getTeamById(standing.teamId, sportId)
    if (!team) throw new Error(`Team with ID ${standing.teamId} not found`)
    return { ...standing, team }
  })
}

// Get enriched match with team data for a specific sport
export function getEnrichedMatch(
  match: Match,
  sportId = "futbol",
): {
  id: string
  homeTeam: Team
  awayTeam: Team
  homeScore?: number
  awayScore?: number
  status: "upcoming" | "completed" | "postponed" | "live"
  date: string
  time: string
  venue: string
  group?: string
  description?: string
} {
  const homeTeam = getTeamById(match.homeTeam, sportId)
  const awayTeam = getTeamById(match.awayTeam, sportId)

  if (!homeTeam) throw new Error(`Home team with ID ${match.homeTeam} not found`)
  if (!awayTeam) throw new Error(`Away team with ID ${match.awayTeam} not found`)

  return {
    ...match,
    homeTeam,
    awayTeam,
  }
}

