"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarDays, ChevronRight, Medal, Shield, Camera } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import YouTubePlayer from "@/components/youtube-player"
import UpcomingMatches from "@/components/upcoming-matches"
import RecentResults from "@/components/recent-results"
import { getFeaturedPhotos, getFeaturedVideos } from "@/lib/media-utils"
import { getAllSports } from "@/lib/sports-utils"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const featuredVideos = getFeaturedVideos()
  const featuredPhotos = getFeaturedPhotos()
  const sports = getAllSports()

  // Obtener el primer video destacado (si existe)
  const featuredVideo = featuredVideos.length > 0 ? featuredVideos[0] : null

  // Obtener hasta 3 fotos destacadas
  const topPhotos = featuredPhotos.slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Copa Vikingos" width={40} height={40} className="h-10 w-auto" />
              <span className="text-xl font-bold">Copa Vikingos</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="font-medium transition-colors hover:text-primary">
              Inicio
            </Link>
            <Link href="/fixture" className="font-medium text-muted-foreground transition-colors hover:text-primary">
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
            <Link href="/videos" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Videos
            </Link>
          </nav>
          <Button variant="outline" size="sm" className="hidden md:flex">
            Temporada 2025
          </Button>
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container py-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="font-medium transition-colors hover:text-primary">
                  Inicio
                </Link>
                <Link
                  href="/fixture"
                  className="font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Fixture
                </Link>
                <Link
                  href="/standings"
                  className="font-medium text-muted-foreground transition-colors hover:text-primary"
                >
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
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">
        {/* Banner principal */}
        <section className="w-full relative">
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
            <Image
              src="/images/banner.png"
              alt="Copa Vikingos 2025"
              fill
              className="object-cover object-center opacity-95"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-40" />
          </div>
          <div className="container absolute bottom-0 left-0 right-0 px-4 py-8 md:py-12">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/fixture">
                  <Button className="gap-1 bg-primary/90 hover:bg-primary">
                    <CalendarDays className="h-4 w-4" />
                    Ver Fixture
                  </Button>
                </Link>
                <Link href="/standings">
                  <Button variant="outline" className="gap-1 bg-background/80 text-primary hover:bg-background">
                    <Medal className="h-4 w-4" />
                    Tabla de Posiciones
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Selector de Deportes - Sin iconos */}
        <section className="container px-4 py-8 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Disciplinas Deportivas</h2>
            <div className="flex flex-wrap gap-2">
              {sports.map((sport) => (
                <Link key={sport.id} href={`/fixture?sport=${sport.id}`}>
                  <Button variant="outline">{sport.name}</Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Video Destacado */}
        {featuredVideo && (
          <section className="container px-4 py-12 md:px-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Video Destacado</h2>
                <Link href="/videos" className="flex items-center text-sm font-medium text-primary">
                  Ver todos
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="h-[300px] md:h-[400px] bg-white rounded-lg shadow-sm">
                <div className="relative h-full w-full">
                  <YouTubePlayer
                    videoId={featuredVideo.youtubeId || featuredVideo.url}
                    title={featuredVideo.title}
                    thumbnail={featuredVideo.thumbnail}
                  />
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-bold text-lg">{featuredVideo.title}</h3>
                <p className="text-sm text-muted-foreground">{featuredVideo.description}</p>
              </div>
            </div>
          </section>
        )}

        {/* Resultados y Próximos Partidos por Deporte - Sin iconos */}
        {sports.map((sport) => (
          <section key={sport.id} className="container px-4 py-12 md:px-6 border-t border-muted">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold tracking-tight">{sport.name}</h2>
              <Link href={`/fixture?sport=${sport.id}`}>
                <Button variant="outline" className="gap-1">
                  Ver todos los partidos
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight">Próximos Partidos</h3>
                  <Link
                    href={`/fixture?sport=${sport.id}`}
                    className="flex items-center text-sm font-medium text-primary"
                  >
                    Ver todos
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <UpcomingMatches sportId={sport.id} />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight">Resultados Recientes</h3>
                  <Link
                    href={`/fixture?sport=${sport.id}&tab=completed`}
                    className="flex items-center text-sm font-medium text-primary"
                  >
                    Ver todos
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <RecentResults sportId={sport.id} />
              </div>
            </div>
          </section>
        ))}

        {/* Collage de Fotos Destacadas */}
        {topPhotos.length > 0 && (
          <section className="container px-4 py-12 md:px-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Fotos Destacadas</h2>
                <Link href="/photos" className="flex items-center text-sm font-medium text-primary">
                  Ver galería
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topPhotos.map((photo) => (
                  <Link key={photo.id} href="/photos" className="block">
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <Image
                        src={photo.url || "/placeholder.svg?height=400&width=400"}
                        alt={photo.caption}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                        <p className="text-sm font-medium">{photo.caption}</p>
                        <p className="text-xs opacity-90">
                          {photo.photographer} • {photo.date}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="container px-4 py-12 md:px-6">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Accesos Rápidos</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-6">
                <Link href="/fixture" className="flex flex-col items-center gap-2 text-center">
                  <CalendarDays className="h-10 w-10 text-primary" />
                  <h3 className="text-lg font-medium">Fixture Completo</h3>
                  <p className="text-sm text-muted-foreground">Calendario de todos los partidos del torneo</p>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardContent className="p-6">
                <Link href="/standings" className="flex flex-col items-center gap-2 text-center">
                  <Medal className="h-10 w-10 text-primary" />
                  <h3 className="text-lg font-medium">Tabla de Posiciones</h3>
                  <p className="text-sm text-muted-foreground">Clasificación actualizada de los equipos</p>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardContent className="p-6">
                <Link href="/teams" className="flex flex-col items-center gap-2 text-center">
                  <Shield className="h-10 w-10 text-primary" />
                  <h3 className="text-lg font-medium">Equipos</h3>
                  <p className="text-sm text-muted-foreground">Información detallada de cada equipo</p>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
              <CardContent className="p-6">
                <Link href="/photos" className="flex flex-col items-center gap-2 text-center">
                  <Camera className="h-10 w-10 text-primary" />
                  <h3 className="text-lg font-medium">Galería de Fotos</h3>
                  <p className="text-sm text-muted-foreground">Revive los mejores momentos del torneo</p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
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

