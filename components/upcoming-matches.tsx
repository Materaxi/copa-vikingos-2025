"use client"

import Link from "next/link"
import { CalendarClock } from "lucide-react"
import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { getEnrichedMatch, getUpcomingMatches, type Team } from "@/lib/data-utils"

type EnrichedMatch = {
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
}

interface UpcomingMatchesProps {
  sportId?: string
}

export default function UpcomingMatches({ sportId = "futbol" }: UpcomingMatchesProps) {
  const [matches, setMatches] = useState<EnrichedMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Get upcoming matches and enrich them with team data
      const upcomingMatches = getUpcomingMatches(3, sportId)
      const enrichedMatches = upcomingMatches.map((match) => getEnrichedMatch(match, sportId))
      setMatches(enrichedMatches)
      setError(null)
    } catch (err) {
      console.error("Error loading upcoming matches:", err)
      setError("Error al cargar los próximos partidos")
    } finally {
      setLoading(false)
    }
  }, [sportId])

  if (loading) {
    return <div className="p-8 text-center">Cargando próximos partidos...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  if (matches.length === 0) {
    return <div className="p-8 text-center">No hay próximos partidos programados</div>
  }

  return (
    <div className="grid gap-4">
      {matches.map((match) => (
        <Card key={match.id}>
          <CardContent className="p-0">
            <Link href={`/match/${match.id}?sport=${sportId}`} className="block p-4 hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full bg-${match.homeTeam.logo}`} />
                  <span className="font-medium">{match.homeTeam.name}</span>
                </div>
                <span className="text-sm">vs</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{match.awayTeam.name}</span>
                  <div className={`h-8 w-8 rounded-full bg-${match.awayTeam.logo}`} />
                </div>
              </div>
              {match.group && <div className="mt-1 text-xs text-muted-foreground">{match.group}</div>}
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarClock className="h-4 w-4" />
                  <span>
                    {match.date}, {match.time}
                  </span>
                </div>
                <span>{match.venue}</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

