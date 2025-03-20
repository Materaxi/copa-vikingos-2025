"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Play, Clock, Calendar, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import YouTubePlayer from "@/components/youtube-player"
import { getAllVideos, type Video } from "@/lib/media-utils"

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  useEffect(() => {
    const loadedVideos = getAllVideos()
    setVideos(loadedVideos)
    setLoading(false)
  }, [])

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
            <h2 className="text-2xl font-bold">Cargando videos...</h2>
            <p className="text-muted-foreground">Por favor espere mientras cargamos los videos.</p>
          </div>
        </main>
      </div>
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
            <Link href="/standings" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Tabla de Posiciones
            </Link>
            <Link href="/teams" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Equipos
            </Link>
            <Link href="/photos" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Fotos
            </Link>
            <Link href="/videos" className="font-medium transition-colors hover:text-primary">
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-slate-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Videos del Torneo</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Revive los mejores momentos del torneo a través de nuestros videos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {selectedVideo && (
          <section className="container px-4 py-8 md:px-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">{selectedVideo.title}</h2>
                <Button variant="outline" size="sm" onClick={() => setSelectedVideo(null)}>
                  Cerrar video
                </Button>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <YouTubePlayer
                  videoId={selectedVideo.youtubeId || selectedVideo.url}
                  title={selectedVideo.title}
                  thumbnail={selectedVideo.thumbnail}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
                <p className="text-muted-foreground">{selectedVideo.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedVideo.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{selectedVideo.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="container px-4 py-8 md:px-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Todos los Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <Play className="h-6 w-6 text-white" fill="white" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold line-clamp-1">{video.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{video.description}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>{video.duration}</span>
                      <span>{video.date}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full mt-2 text-primary"
                      onClick={() => setSelectedVideo(video)}
                    >
                      Ver video
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
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

