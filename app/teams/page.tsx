"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SportSelector from "@/components/sport-selector"
import { getAllTeams, type Team } from "@/lib/data-utils"

export default function TeamsPage() {
  const searchParams = useSearchParams()
  const sportParam = searchParams.get("sport")
  const [sportId, setSportId] = useState(sportParam || "futbol")
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Update sportId when URL parameter changes
    if (sportParam) {
      setSportId(sportParam)
    }
  }, [sportParam])

  useEffect(() => {
    // Load teams for the current sport
    setLoading(true)
    const loadedTeams = getAllTeams(sportId)
    setTeams(loadedTeams)
    setLoading(false)
  }, [sportId])

  // Group teams by group if they have groups
  const hasGroups = teams.some((team) => team.group)
  const groupedTeams = hasGroups
    ? teams.reduce<Record<string, Team[]>>((acc, team) => {
        const group = team.group || "Sin grupo"
        if (!acc[group]) {
          acc[group] = []
        }
        acc[group].push(team)
        return acc
      }, {})
    : { "Todos los equipos": teams }

  // Function to get team logo
  const getTeamLogo = (team: Team) => {
    // Check if we have a custom logo for this team
    const customLogos: Record<string, string> = {
      "generacion-kabob": "/images/teams/kabod.png",
      mekadesh: "/images/teams/mekadesh.png",
      anonymous: "/images/teams/anonymous.png",
      shekinah: "/images/teams/shekinah.png",
    }

    if (customLogos[team.id]) {
      return customLogos[team.id]
    }

    // Otherwise use a placeholder with the team's color
    return `/placeholder.svg?height=100&width=100&text=${team.shortName}`
  }

  if (loading) {
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
            <h2 className="text-2xl font-bold">Cargando equipos...</h2>
            <p className="text-muted-foreground">Por favor espere mientras cargamos la información de los equipos.</p>
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Equipos</h1>
              <p className="text-muted-foreground">Conoce a todos los equipos participantes</p>
            </div>
            <SportSelector currentSport={sportId} />
          </div>

          <div className="mt-8 space-y-8">
            {Object.entries(groupedTeams).map(([group, groupTeams]) => (
              <div key={group} className="space-y-4">
                <h2 className="text-2xl font-bold">{group}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {groupTeams.map((team) => (
                    <Link key={team.id} href={`/teams/${team.id}?sport=${sportId}`}>
                      <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="aspect-square relative">
                          <Image
                            src={getTeamLogo(team) || "/placeholder.svg"}
                            alt={team.name}
                            fill
                            className="object-contain p-4"
                          />
                        </div>
                        <CardContent className="p-4 text-center">
                          <h3 className="text-lg font-bold">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">{team.city}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
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

