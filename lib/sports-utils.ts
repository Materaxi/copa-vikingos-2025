import sportsData from "@/data/sports.json"

export type Sport = {
  id: string
  name: string
  icon: string
  format: string
  description: string
}

// Get all sports
export function getAllSports(): Sport[] {
  return sportsData.sports
}

// Get sport by ID
export function getSportById(id: string): Sport | undefined {
  return sportsData.sports.find((sport) => sport.id === id)
}

// Get default sport
export function getDefaultSport(): Sport {
  return sportsData.sports[0]
}

