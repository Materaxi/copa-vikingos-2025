"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SportSelector from "@/components/sport-selector"
import { getEnrichedStandingsByGroup, getEnrichedStandings, type Team, type Standing } from "@/lib/data-utils"
import { getSportById } from "@/lib/sports-utils"

type EnrichedStanding = Standing & { team: Team }

export default function StandingsPage() {
  const searchParams = useSearchParams()
  const sportParam = searchParams.get("sport")
  const [sportId, setSportId] = useState(sportParam || "futbol")

  const [groupAStandings, setGroupAStandings] = useState<EnrichedStanding[]>([])
  const [groupBStandings, setGroupBStandings] = useState<EnrichedStanding[]>([])
  const [generalStandings, setGeneralStandings] = useState<EnrichedStanding[]>([])
  const [hasGroups, setHasGroups] = useState(true)

  useEffect(() => {
    // Update sportId when URL parameter changes
    if (sportParam) {
      setSportId(sportParam)
    }
  }, [sportParam])

  useEffect(() => {
    // Load standings data for the current sport
    const sport = getSportById(sportId)

    if (sport?.format === "groups") {
      // Para deportes con formato de grupos
      setHasGroups(true)

      // Cargar standings para cada grupo
      const loadedGroupAStandings = getEnrichedStandingsByGroup("A", sportId)
      const loadedGroupBStandings = getEnrichedStandingsByGroup("B", sportId)

      // Ordenar por puntos (de mayor a menor) y luego por diferencia de goles/sets/puntos
      const sortStandings = (standings: EnrichedStanding[]) => {
        return standings.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points // Primero ordenar por puntos (descendente)
          }

          // Usar la diferencia apropiada según el deporte
          if (a.goalDifference !== undefined && b.goalDifference !== undefined) {
            return b.goalDifference - a.goalDifference
          } else if (a.setDifference !== undefined && b.setDifference !== undefined) {
            return b.setDifference - a.setDifference
          } else if (a.pointDifference !== undefined && b.pointDifference !== undefined) {
            return b.pointDifference - a.pointDifference
          }

          return 0
        })
      }

      // Actualizar las posiciones después de ordenar
      const updatePositions = (standings: EnrichedStanding[]) => {
        return standings.map((standing, index) => ({
          ...standing,
          position: index + 1,
        }))
      }

      // Ordenar y actualizar posiciones para cada grupo
      const sortedGroupAStandings = updatePositions(sortStandings([...loadedGroupAStandings]))
      const sortedGroupBStandings = updatePositions(sortStandings([...loadedGroupBStandings]))

      setGroupAStandings(sortedGroupAStandings)
      setGroupBStandings(sortedGroupBStandings)
      setGeneralStandings([]) // Limpiar standings generales
    } else {
      // Para deportes con formato de todos contra todos
      setHasGroups(false)

      // Cargar todos los standings
      const loadedStandings = getEnrichedStandings(sportId)

      // Ordenar por puntos y diferencia
      const sortedStandings = loadedStandings.sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points
        }

        // Usar la diferencia apropiada según el deporte
        if (a.goalDifference !== undefined && b.goalDifference !== undefined) {
          return b.goalDifference - a.goalDifference
        } else if (a.pointDifference !== undefined && b.pointDifference !== undefined) {
          return b.pointDifference - a.pointDifference
        }

        return 0
      })

      // Actualizar posiciones
      const updatedStandings = sortedStandings.map((standing, index) => ({
        ...standing,
        position: index + 1,
      }))

      setGeneralStandings(updatedStandings)
      setGroupAStandings([]) // Limpiar standings de grupos
      setGroupBStandings([])
    }
  }, [sportId])

  if (
    (hasGroups && (groupAStandings.length === 0 || groupBStandings.length === 0)) ||
    (!hasGroups && generalStandings.length === 0)
  ) {
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
            <p className="text-muted-foreground">
              Por favor espere mientras cargamos la información de la tabla de posiciones.
            </p>
          </div>
        </main>
      </div>
    )
  }

  // Helper function to get background class based on status and position
  const getRowClass = (standing: EnrichedStanding) => {
    // Resaltar los dos primeros equipos
    if (standing.position <= 2) {
      return "bg-green-50 dark:bg-green-950/20 font-medium"
    }

    // Aplicar clases basadas en el status
    switch (standing.status) {
      case "promotion":
        return "bg-green-50/50 dark:bg-green-950/10"
      case "playoff":
        return "bg-yellow-50 dark:bg-yellow-950/20"
      case "relegation":
        return "bg-red-50 dark:bg-red-950/20"
      default:
        return ""
    }
  }

  // Helper function to get the appropriate stat columns based on sport
  const getStatColumns = (standing: EnrichedStanding) => {
    if (standing.goalsFor !== undefined && standing.goalsAgainst !== undefined) {
      // Fútbol
      return (
        <>
          <TableCell className="text-center">{standing.goalsFor}</TableCell>
          <TableCell className="text-center">{standing.goalsAgainst}</TableCell>
          <TableCell className="text-center">
            {standing.goalDifference !== undefined &&
              (standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference)}
          </TableCell>
        </>
      )
    } else if (standing.setsFor !== undefined && standing.setsAgainst !== undefined) {
      // Vóley
      return (
        <>
          <TableCell className="text-center">{standing.setsFor}</TableCell>
          <TableCell className="text-center">{standing.setsAgainst}</TableCell>
          <TableCell className="text-center">
            {standing.setDifference !== undefined &&
              (standing.setDifference > 0 ? `+${standing.setDifference}` : standing.setDifference)}
          </TableCell>
        </>
      )
    } else if (standing.pointsFor !== undefined && standing.pointsAgainst !== undefined) {
      // Básquet
      return (
        <>
          <TableCell className="text-center">{standing.pointsFor}</TableCell>
          <TableCell className="text-center">{standing.pointsAgainst}</TableCell>
          <TableCell className="text-center">
            {standing.pointDifference !== undefined &&
              (standing.pointDifference > 0 ? `+${standing.pointDifference}` : standing.pointDifference)}
          </TableCell>
        </>
      )
    }

    // Default fallback
    return (
      <>
        <TableCell className="text-center">-</TableCell>
        <TableCell className="text-center">-</TableCell>
        <TableCell className="text-center">-</TableCell>
      </>
    )
  }

  // Helper function to get the appropriate stat headers based on sport
  const getStatHeaders = () => {
    const sport = getSportById(sportId)

    if (sportId === "futbol" || sportId === "futbol-damas") {
      return (
        <>
          <TableHead className="text-center">GF</TableHead>
          <TableHead className="text-center">GC</TableHead>
          <TableHead className="text-center">DG</TableHead>
        </>
      )
    } else if (sportId === "voley") {
      return (
        <>
          <TableHead className="text-center">SF</TableHead>
          <TableHead className="text-center">SC</TableHead>
          <TableHead className="text-center">DS</TableHead>
        </>
      )
    } else if (sportId === "basquet") {
      return (
        <>
          <TableHead className="text-center">PF</TableHead>
          <TableHead className="text-center">PC</TableHead>
          <TableHead className="text-center">DP</TableHead>
        </>
      )
    }

    // Default fallback
    return (
      <>
        <TableHead className="text-center">F</TableHead>
        <TableHead className="text-center">C</TableHead>
        <TableHead className="text-center">DIF</TableHead>
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
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
            <Link href="/standings" className="font-medium transition-colors hover:text-primary">
              Tabla de Posiciones
            </Link>
            <Link href="/teams" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Equipos
            </Link>
            <Link href="/photos" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Fotos
            </Link>
            <Link href="/videos" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Videos
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
              <h1 className="text-3xl font-bold tracking-tight">Tabla de Posiciones</h1>
              <p className="text-muted-foreground">Clasificación actualizada de los equipos</p>
            </div>
            <SportSelector currentSport={sportId} />
          </div>

          {hasGroups ? (
            <Tabs defaultValue="groupA" className="mt-6">
              <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-2">
                <TabsTrigger value="groupA">Grupo A</TabsTrigger>
                <TabsTrigger value="groupB">Grupo B</TabsTrigger>
              </TabsList>
              <TabsContent value="groupA" className="mt-6">
                <Card>
                  <CardHeader className="bg-muted/50">
                    <CardTitle>Grupo A</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Pos</TableHead>
                          <TableHead>Equipo</TableHead>
                          <TableHead className="text-center font-bold">Pts</TableHead>
                          <TableHead className="text-center">PJ</TableHead>
                          <TableHead className="text-center">G</TableHead>
                          <TableHead className="text-center">E</TableHead>
                          <TableHead className="text-center">P</TableHead>
                          {getStatHeaders()}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupAStandings.map((standing) => (
                          <TableRow key={standing.teamId} className={getRowClass(standing)}>
                            <TableCell className="font-medium">{standing.position}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`h-6 w-6 rounded-full bg-${standing.team.logo}`} />
                                <span>{standing.team.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-center">{standing.points}</TableCell>
                            <TableCell className="text-center">{standing.played}</TableCell>
                            <TableCell className="text-center">{standing.won}</TableCell>
                            <TableCell className="text-center">{standing.drawn}</TableCell>
                            <TableCell className="text-center">{standing.lost}</TableCell>
                            {getStatColumns(standing)}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card className="bg-green-50 dark:bg-green-950/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-sm font-medium">Clasificación a semifinales (1° y 2° puesto)</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="groupB" className="mt-6">
                <Card>
                  <CardHeader className="bg-muted/50">
                    <CardTitle>Grupo B</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Pos</TableHead>
                          <TableHead>Equipo</TableHead>
                          <TableHead className="text-center font-bold">Pts</TableHead>
                          <TableHead className="text-center">PJ</TableHead>
                          <TableHead className="text-center">G</TableHead>
                          <TableHead className="text-center">E</TableHead>
                          <TableHead className="text-center">P</TableHead>
                          {getStatHeaders()}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupBStandings.map((standing) => (
                          <TableRow key={standing.teamId} className={getRowClass(standing)}>
                            <TableCell className="font-medium">{standing.position}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`h-6 w-6 rounded-full bg-${standing.team.logo}`} />
                                <span>{standing.team.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-center">{standing.points}</TableCell>
                            <TableCell className="text-center">{standing.played}</TableCell>
                            <TableCell className="text-center">{standing.won}</TableCell>
                            <TableCell className="text-center">{standing.drawn}</TableCell>
                            <TableCell className="text-center">{standing.lost}</TableCell>
                            {getStatColumns(standing)}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card className="bg-green-50 dark:bg-green-950/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-sm font-medium">Clasificación a semifinales (1° y 2° puesto)</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="mt-6">
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle>Tabla General</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Pos</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead className="text-center font-bold">Pts</TableHead>
                        <TableHead className="text-center">PJ</TableHead>
                        <TableHead className="text-center">G</TableHead>
                        <TableHead className="text-center">E</TableHead>
                        <TableHead className="text-center">P</TableHead>
                        {getStatHeaders()}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generalStandings.map((standing) => (
                        <TableRow key={standing.teamId} className={getRowClass(standing)}>
                          <TableCell className="font-medium">{standing.position}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`h-6 w-6 rounded-full bg-${standing.team.logo}`} />
                              <span>{standing.team.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-center">{standing.points}</TableCell>
                          <TableCell className="text-center">{standing.played}</TableCell>
                          <TableCell className="text-center">{standing.won}</TableCell>
                          <TableCell className="text-center">{standing.drawn}</TableCell>
                          <TableCell className="text-center">{standing.lost}</TableCell>
                          {getStatColumns(standing)}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="bg-green-50 dark:bg-green-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Clasificación a la final (1° y 2° puesto)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Copa Vikingos. Todos los derechos reservados.
          </p>
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

