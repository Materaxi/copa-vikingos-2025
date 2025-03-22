"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import MatchCard from "@/components/match-card"
import { getTeamById, getMatchesByTeam, type Team, type Match } from "@/lib/data-utils"

// Datos de ejemplo para jugadores
const mockPlayers = [
  {
    id: "player-1",
    name: "Juan Pérez",
    number: 10,
    position: "Delantero",
    age: 25,
    goals: 5,
    assists: 3,
    yellowCards: 2,
    redCards: 0,
  },
  {
    id: "player-2",
    name: "Carlos Rodríguez",
    number: 5,
    position: "Mediocampista",
    age: 28,
    goals: 2,
    assists: 6,
    yellowCards: 1,
    redCards: 0,
  },
  {
    id: "player-3",
    name: "Miguel González",
    number: 1,
    position: "Portero",
    age: 30,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: "player-4",
    name: "Roberto Sánchez",
    number: 4,
    position: "Defensa",
    age: 27,
    goals: 1,
    assists: 0,
    yellowCards: 3,
    redCards: 1,
  },
  {
    id: "player-5",
    name: "Alejandro Martínez",
    number: 7,
    position: "Mediocampista",
    age: 24,
    goals: 3,
    assists: 2,
    yellowCards: 2,
    redCards: 0,
  },
]

export default function TeamDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const teamId = params.teamId as string
  const sportParam = searchParams.get("sport")
  const [sportId, setSportId] = useState(sportParam || "futbol")

  const [team, setTeam] = useState<Team | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Update sportId when URL parameter changes
    if (sportParam) {
      setSportId(sportParam)
    }
  }, [sportParam])

  useEffect(() => {
    // Load team and matches data
    setLoading(true)
    const loadedTeam = getTeamById(teamId, sportId)
    const loadedMatches = getMatchesByTeam(teamId, sportId)

    if (loadedTeam) {
      setTeam(loadedTeam)
      setMatches(loadedMatches)
    }
    setLoading(false)
  }, [teamId, sportId])

  // Function to get team logo
  const getTeamLogo = (team: Team) => {
    // Check if we have a custom logo for this team
    const customLogos: Record<string, string> = {
      "generacion-kabob": "/images/teams/kabod.png",
      mekadesh: "/images/teams/mekadesh.png",
      anonymous: "/images/teams/anonymous.png",
      shekinah: "/images/teams/shekinah.png",
      jedaiah: "/images/teams/jedaiah.png",
      "zelotes": "/images/teams/zelotes.png",
      "kerigma": "/images/teams/kerigma.png",
      "hombres-fuego": "/images/teams/hdf.png",
    }

    if (customLogos[team.id]) {
      return customLogos[team.id]
    }

    // Otherwise use a placeholder with the team's color
    return `/placeholder.svg?height=200&width=200&text=${team.shortName}`
  }

  if (loading || !team) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/images/logo.png" alt="Copa Vikingos" width={30} height={30} className="h-8 w-auto" />
                <span className="text-xl font-bold">Copa Vikingos</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Cargando información del equipo...</h2>
            <p className="text-muted-foreground">Por favor espere mientras cargamos los datos.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Copa Vikingos" width={30} height={30} className="h-8 w-auto" />
              <span className="text-xl font-bold">Copa Vikingos</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Inicio
            </Link>
            <Link href="/fixture" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Fixture
            </Link>
            <Link href="/standings" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Tabla de Posiciones
            </Link>
            <Link href="/teams" className="font-medium transition-colors hover:text-primary">
              Equipos
            </Link>
            <Link href="/photos" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Fotos
            </Link>
          </nav>
          <Button variant="outline" size="sm" className="hidden md:flex">
            Temporada 2025
          </Button>
          <Button variant="outline" size="icon" className="md:hidden">
            <span className="sr-only">Menú</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="flex items-center gap-2 mb-6">
            <Link href={`/teams?sport=${sportId}`}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Detalle del Equipo</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-48 h-48 relative mb-4">
                  <Image
                    src={getTeamLogo(team) || "/placeholder.svg"}
                    alt={team.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-center">{team.name}</h2>
                {team.group && (
                  <div className="mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Grupo {team.group}
                  </div>
                )}
                <div className="mt-4 w-full space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{team.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Estadio: {team.stadium}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="h-4 w-4" />
                    <span>Títulos: 0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2">
              <Tabs defaultValue="players">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="players">Jugadores</TabsTrigger>
                  <TabsTrigger value="matches">Partidos</TabsTrigger>
                  <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                </TabsList>
                <TabsContent value="players" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Plantilla</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Posición</TableHead>
                            <TableHead className="text-right">Edad</TableHead>
                            <TableHead className="text-right">Goles</TableHead>
                            <TableHead className="text-right">Asistencias</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPlayers.map((player) => (
                            <TableRow key={player.id}>
                              <TableCell className="font-medium">{player.number}</TableCell>
                              <TableCell>{player.name}</TableCell>
                              <TableCell>{player.position}</TableCell>
                              <TableCell className="text-right">{player.age}</TableCell>
                              <TableCell className="text-right">{player.goals}</TableCell>
                              <TableCell className="text-right">{player.assists}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="matches" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Calendario de Partidos</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      {matches.length > 0 ? (
                        matches.map((match) => (
                          <MatchCard
                            key={match.id}
                            homeTeam={match.homeTeam}
                            awayTeam={match.awayTeam}
                            homeScore={match.homeScore}
                            awayScore={match.awayScore}
                            status={match.status}
                            date={match.date}
                            time={match.time}
                            venue={match.venue}
                            matchId={match.id}
                            group={match.group}
                            sportId={sportId}
                          />
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-muted-foreground">No hay partidos programados para este equipo.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="stats" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estadísticas del Equipo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Partidos Jugados</p>
                          <p className="text-3xl font-bold">1</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Victorias</p>
                          <p className="text-3xl font-bold text-green-600">1</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Empates</p>
                          <p className="text-3xl font-bold text-amber-600">0</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Derrotas</p>
                          <p className="text-3xl font-bold text-red-600">0</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Goles a Favor</p>
                          <p className="text-3xl font-bold">2</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Goles en Contra</p>
                          <p className="text-3xl font-bold">1</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Diferencia de Goles</p>
                          <p className="text-3xl font-bold text-primary">+1</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Puntos</p>
                          <p className="text-3xl font-bold text-primary">3</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Copa Vikingos" width={30} height={30} className="h-8 w-auto" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 Copa Vikingos. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="underline underline-offset-4">
              Acerca de
            </Link>
            <Link href="/contact" className="underline underline-offset-4">
              Contacto
            </Link>
            <Link href="/privacy" className="underline underline-offset-4">
              Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

