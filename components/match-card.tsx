import { CalendarClock, CalendarCheck, Clock } from "lucide-react"
import Link from "next/link"
import { getTeamById } from "@/lib/data-utils"

interface MatchCardProps {
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  status: "upcoming" | "completed" | "postponed" | "live"
  date: string
  time: string
  venue: string
  matchId?: string
  group?: string
  description?: string
  sportId?: string
}

export default function MatchCard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  date,
  time,
  venue,
  matchId = "0",
  group,
  description,
  sportId = "futbol",
}: MatchCardProps) {
  // Get team data from IDs
  const homeTeamData = getTeamById(homeTeam, sportId)
  const awayTeamData = getTeamById(awayTeam, sportId)

  if (!homeTeamData || !awayTeamData) {
    return <div>Error: Equipo no encontrado</div>
  }

  const isKnockoutStage = group === "Semifinal" || group === "Final"

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        {group && (
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{group}</span>
            {description && <span className="text-xs text-muted-foreground">{description}</span>}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full bg-${homeTeamData.logo}`} />
            <div className="flex flex-col">
              <span className="font-medium">{homeTeamData.name}</span>
              {status === "completed" && <span className="text-2xl font-bold">{homeScore}</span>}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {status === "upcoming" && "Próximo"}
            {status === "completed" && "Finalizado"}
            {status === "postponed" && "Pospuesto"}
            {status === "live" && (
              <span className="flex items-center gap-1 text-red-500">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                En vivo
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="font-medium">{awayTeamData.name}</span>
              {status === "completed" && <span className="text-2xl font-bold">{awayScore}</span>}
            </div>
            <div className={`h-8 w-8 rounded-full bg-${awayTeamData.logo}`} />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            {status === "upcoming" ? (
              <CalendarClock className="h-4 w-4" />
            ) : status === "completed" ? (
              <CalendarCheck className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
            <span>
              {date}, {time}
            </span>
          </div>
          <span>{venue}</span>
        </div>
      </div>
      <div className="border-t p-2">
        <Link
          href={`/match/${matchId}?sport=${sportId}`}
          className="flex w-full items-center justify-center text-xs font-medium text-primary hover:underline"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  )
}

