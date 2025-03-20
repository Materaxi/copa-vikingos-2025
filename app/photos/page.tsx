"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { getAllGalleries, getAllPhotos, getFeaturedPhotos, type Gallery, type Photo } from "@/lib/media-utils"
import { getRoundById } from "@/lib/data-utils"

export default function PhotosPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([])
  const [allPhotos, setAllPhotos] = useState<Photo[]>([])

  useEffect(() => {
    const loadedGalleries = getAllGalleries()
    const loadedFeaturedPhotos = getFeaturedPhotos()
    const loadedAllPhotos = getAllPhotos()

    setGalleries(loadedGalleries)
    setFeaturedPhotos(loadedFeaturedPhotos)
    setAllPhotos(loadedAllPhotos)
  }, [])

  if (galleries.length === 0) {
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
            <h2 className="text-2xl font-bold">Cargando galerías...</h2>
            <p className="text-muted-foreground">Por favor espere mientras cargamos las galerías de fotos.</p>
          </div>
        </main>
      </div>
    )
  }

  // Asignar tamaños aleatorios a las fotos para el collage
  const photoSizes = allPhotos.slice(0, 12).map((_, index) => {
    // Asignar tamaños de manera que haya variedad pero con cierto patrón
    if (index % 7 === 0 || index % 11 === 0) return "photo-large"
    if (index % 5 === 0 || index % 3 === 0) return "photo-medium"
    return "photo-small"
  })

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
            <Link href="/teams" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Equipos
            </Link>
            <Link href="/photos" className="font-medium transition-colors hover:text-primary">
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Galería de Fotos</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Revive los mejores momentos del torneo a través de nuestras galerías fotográficas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Collage de fotos destacadas */}
        <section className="container px-4 py-12 md:px-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Fotos Destacadas</h2>
            </div>
            <div className="photo-collage grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
              {allPhotos.slice(0, 12).map((photo, index) => (
                <div
                  key={photo.id}
                  className={`relative overflow-hidden rounded-md
                    ${
                      photoSizes[index] === "photo-large"
                        ? "col-span-2 row-span-2"
                        : photoSizes[index] === "photo-medium"
                          ? "col-span-2"
                          : ""
                    }
                  `}
                >
                  <div
                    className={`
                    ${
                      photoSizes[index] === "photo-large"
                        ? "aspect-square"
                        : photoSizes[index] === "photo-medium"
                          ? "aspect-video"
                          : "aspect-square"
                    }
                  `}
                  >
                    <Image
                      src={photo.thumbnail || "/placeholder.svg"}
                      alt={photo.caption}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white">
                    <p className="text-sm font-medium line-clamp-1">{photo.caption}</p>
                    <p className="text-xs opacity-80">{photo.photographer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container px-4 py-12 md:px-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Galerías por Fecha</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map((gallery) => {
                const round = getRoundById(gallery.roundId)
                return (
                  <div key={gallery.id} className="group relative overflow-hidden rounded-lg">
                    <div className="relative aspect-video">
                      <Image
                        src={gallery.coverImage || "/placeholder.svg"}
                        alt={gallery.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{gallery.title}</h3>
                      <p className="text-sm opacity-90">{round?.dateRange}</p>
                      <p className="text-sm mt-1">{gallery.photos.length} fotos</p>
                      <Link href={`/photos/${gallery.id}`}>
                        <Button
                          variant="outline"
                          className="mt-3 text-white border-white hover:bg-white/20 hover:text-white"
                        >
                          Ver galería
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
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

