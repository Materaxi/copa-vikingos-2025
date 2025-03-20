"use client"

import Link from "next/link"
import { CalendarCheck } from "lucide-react"
import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { getEnrichedMatch, getRecentResults, type Team } from "@/lib/data-utils"

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

interface RecentResultsProps {
  sportId?: string
}

export default function RecentResults({ sportId = "futbol" }: RecentResultsProps) {
  const [matches, setMatches] = useState<EnrichedMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Get recent results and enrich them with team data
      const recentMatches = getRecentResults(3, sportId)
      const enrichedMatches = recentMatches.map((match) => getEnrichedMatch(match, sportId))
      setMatches(enrichedMatches)
      setError(null)
    } catch (err) {
      console.error("Error loading recent results:", err)
      setError("Error al cargar los resultados recientes")
    } finally {
      setLoading(false)
    }
  }, [sportId])

  if (loading) {
    return <div className="p-8 text-center">Cargando resultados recientes...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  if (matches.length === 0) {
    return <div className="p-8 text-center">No hay resultados recientes disponibles</div>
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
                  <div className="flex flex-col">
                    <span className="font-medium">{match.homeTeam.name}</span>
                    <span className="text-2xl font-bold">{match.homeScore}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Finalizado</div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <span className="font-medium">{match.awayTeam.name}</span>
                    <span className="text-2xl font-bold">{match.awayScore}</span>
                  </div>
                  <div className={`h-8 w-8 rounded-full bg-${match.awayTeam.logo}`} />
                </div>
              </div>
              {match.group && <div className="mt-1 text-xs text-muted-foreground">{match.group}</div>}
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarCheck className="h-4 w-4" />
                  <span>{match.date}</span>
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

