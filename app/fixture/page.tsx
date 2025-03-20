"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, Filter, Camera, Trophy } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MatchCard from "@/components/match-card"
import SportSelector from "@/components/sport-selector"
import { getAllTeams, getGroupStageRounds, getKnockoutStageRounds, type Round, type Team } from "@/lib/data-utils"
import { getGalleryByRoundId } from "@/lib/photo-utils"

export default function FixturePage() {
  const searchParams = useSearchParams()
  const sportParam = searchParams.get("sport")
  const [sportId, setSportId] = useState(sportParam || "futbol")

  const [groupStageRounds, setGroupStageRounds] = useState<Round[]>([])
  const [knockoutStageRounds, setKnockoutStageRounds] = useState<Round[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0)

  useEffect(() => {
    // Update sportId when URL parameter changes
    if (sportParam) {
      setSportId(sportParam)
    }
  }, [sportParam])

  useEffect(() => {
    // Load rounds and teams for the current sport
    const loadedGroupStageRounds = getGroupStageRounds(sportId)
    const loadedKnockoutStageRounds = getKnockoutStageRounds(sportId)
    const loadedTeams = getAllTeams(sportId)

    setGroupStageRounds(loadedGroupStageRounds)
    setKnockoutStageRounds(loadedKnockoutStageRounds)
    setTeams(loadedTeams)
    setCurrentRoundIndex(0) // Reset to first round when sport changes
    setSelectedTeam("all") // Reset team filter
    setSelectedGroup("all") // Reset group filter
  }, [sportId])

  const handlePreviousRound = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1)
    }
  }

  const handleNextRound = () => {
    if (currentRoundIndex < groupStageRounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1)
    }
  }

  // Filter matches by team and/or group
  const getFilteredMatches = (round: Round) => {
    let filteredMatches = round.matches

    if (selectedTeam !== "all") {
      filteredMatches = filteredMatches.filter(
        (match) => match.homeTeam === selectedTeam || match.awayTeam === selectedTeam,
      )
    }

    if (selectedGroup !== "all") {
      filteredMatches = filteredMatches.filter((match) => match.group === selectedGroup)
    }

    return filteredMatches
  }

  if (groupStageRounds.length === 0 || teams.length === 0) {
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
            <h2 className="text-2xl font-bold">Cargando datos...</h2>
            <p className="text-muted-foreground">Por favor espere mientras cargamos la información del fixture.</p>
          </div>
        </main>
      </div>
    )
  }

  const currentRound = groupStageRounds[currentRoundIndex]
  const hasGallery = getGalleryByRoundId(currentRound.id)

  // Determine if we should show group selector
  const hasGroups = teams.some((team) => team.group)

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
            <Link href="/fixture" className="font-medium transition-colors hover:text-primary">
              Fixture
            </Link>
            <Link href="/standings" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Tabla de Posiciones
            </Link>
            <Link href="/teams" className="font-medium text-muted-foreground transition-colors hover:text-primary">
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Fixture Completo</h1>
              <p className="text-muted-foreground">Calendario de todos los partidos del torneo</p>
            </div>
            <SportSelector currentSport={sportId} />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row mt-6">
            <Select defaultValue="all" value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por equipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los equipos</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasGroups && (
              <Select defaultValue="all" value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grupos</SelectItem>
                  <SelectItem value="A">Grupo A</SelectItem>
                  <SelectItem value="B">Grupo B</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filtrar</span>
            </Button>
          </div>

          <Tabs defaultValue="group-stage" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-2">
              <TabsTrigger value="group-stage">Fase Regular</TabsTrigger>
              <TabsTrigger value="knockout-stage">Fase Final</TabsTrigger>
            </TabsList>
            <TabsContent value="group-stage" className="mt-6">
              <div className="space-y-8">
                {groupStageRounds.map((round, index) => (
                  <Card key={round.id} className={index !== currentRoundIndex ? "hidden" : ""}>
                    <CardHeader className="bg-muted/50">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{round.name}</span>
                          {hasGallery && (
                            <Link href={`/photos/${hasGallery.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Camera className="h-4 w-4" />
                                Ver fotos
                              </Button>
                            </Link>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handlePreviousRound}
                            disabled={currentRoundIndex === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Fecha anterior</span>
                          </Button>
                          <span className="text-sm font-medium">{round.dateRange}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleNextRound}
                            disabled={currentRoundIndex === groupStageRounds.length - 1}
                          >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Fecha siguiente</span>
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 p-6">
                      {getFilteredMatches(round).length > 0 ? (
                        getFilteredMatches(round).map((match) => (
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
                          <p className="text-muted-foreground">
                            No hay partidos para mostrar con los filtros seleccionados.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="knockout-stage" className="mt-6">
              <div className="space-y-8">
                {knockoutStageRounds.length > 0 ? (
                  knockoutStageRounds.map((round) => (
                    <Card key={round.id}>
                      <CardHeader className="bg-muted/50">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-primary" />
                            <span>{round.name}</span>
                          </div>
                          <span className="text-sm font-medium">{round.dateRange}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 p-6">
                        {round.matches.map((match) => (
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
                            description={match.description}
                            sportId={sportId}
                          />
                        ))}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No hay partidos de fase final programados aún.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
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

