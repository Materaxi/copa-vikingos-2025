"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getGalleryById, getEnrichedGallery, type Gallery, type Photo } from "@/lib/media-utils"
import type { Match } from "@/lib/data-utils"

type EnrichedPhoto = Photo & {
  match?: Match
}

type EnrichedGallery = Gallery & {
  round?: any
  photos: EnrichedPhoto[]
}

export default function GalleryPage() {
  const params = useParams()
  const galleryId = params.galleryId as string

  const [gallery, setGallery] = useState<EnrichedGallery | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<EnrichedPhoto | null>(null)

  useEffect(() => {
    const loadGallery = () => {
      const rawGallery = getGalleryById(galleryId)
      if (rawGallery) {
        const enriched = getEnrichedGallery(rawGallery) as EnrichedGallery
        setGallery(enriched)
      }
    }

    loadGallery()
  }, [galleryId])

  if (!gallery) {
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
            <h2 className="text-2xl font-bold">Cargando galería...</h2>
            <p className="text-muted-foreground">Por favor espere mientras cargamos las fotos.</p>
          </div>
        </main>
      </div>
    )
  }

  // Asignar tamaños aleatorios a las fotos para el collage
  const photoSizes = gallery.photos.map((_, index) => {
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
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Link href="/photos">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Volver</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{gallery.title}</h1>
                <p className="text-muted-foreground">
                  {gallery.round?.dateRange} • {gallery.photos.length} fotos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Descargar todas
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
            </div>
          </div>

          {/* Collage de fotos con diferentes tamaños */}
          <div className="mt-8 photo-collage grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
            {gallery.photos.map((photo, index) => (
              <Dialog key={photo.id}>
                <DialogTrigger asChild>
                  <div
                    className={`relative overflow-hidden rounded-md cursor-pointer hover:opacity-90 transition-opacity
                      ${
                        photoSizes[index] === "photo-large"
                          ? "col-span-2 row-span-2"
                          : photoSizes[index] === "photo-medium"
                            ? "col-span-2"
                            : ""
                      }
                    `}
                    onClick={() => setSelectedPhoto(photo)}
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
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-sm font-medium line-clamp-1">{photo.caption}</p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{photo.caption}</DialogTitle>
                    <DialogDescription>
                      {photo.date} • {photo.photographer}
                      {photo.match && ` • Partido: ${photo.match.homeTeam} vs ${photo.match.awayTeam}`}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <Image src={photo.url || "/placeholder.svg"} alt={photo.caption} fill className="object-contain" />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Descargar
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      Compartir
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
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

