import photosData from "@/data/photos.json"
import videosData from "@/data/videos.json"
import { getRoundById, getMatchById } from "@/lib/data-utils"

export type Photo = {
  id: string
  matchId: string
  url: string
  thumbnail: string
  caption: string
  photographer: string
  date: string
}

export type Gallery = {
  id: string
  title: string
  description: string
  roundId: string
  coverImage: string
  photos: Photo[]
}

export type Video = {
  id: string
  title: string
  description: string
  thumbnail: string
  url: string
  youtubeId?: string
  duration: string
  date: string
}

// Get all galleries
export function getAllGalleries(): Gallery[] {
  return photosData.galleries
}

// Get gallery by ID
export function getGalleryById(id: string): Gallery | undefined {
  return photosData.galleries.find((gallery) => gallery.id === id)
}

// Get gallery by round ID
export function getGalleryByRoundId(roundId: string): Gallery | undefined {
  return photosData.galleries.find((gallery) => gallery.roundId === roundId)
}

// Get photos by match ID
export function getPhotosByMatchId(matchId: string): Photo[] {
  return photosData.galleries.flatMap((gallery) => gallery.photos).filter((photo) => photo.matchId === matchId)
}

// Get featured photos
export function getFeaturedPhotos(): Photo[] {
  return photosData.featuredPhotos
}

// Get all photos
export function getAllPhotos(): Photo[] {
  return photosData.galleries.flatMap((gallery) => gallery.photos)
}

// Get enriched gallery with round and match data
export function getEnrichedGallery(gallery: Gallery) {
  const round = getRoundById(gallery.roundId)

  const enrichedPhotos = gallery.photos.map((photo) => {
    const match = getMatchById(photo.matchId)
    return {
      ...photo,
      match,
    }
  })

  return {
    ...gallery,
    round,
    photos: enrichedPhotos,
  }
}

// Get all videos
export function getAllVideos(): Video[] {
  return videosData.videos
}

// Get featured videos
export function getFeaturedVideos(): Video[] {
  return videosData.featuredVideos
}

// Get video by ID
export function getVideoById(id: string): Video | undefined {
  return videosData.videos.find((video) => video.id === id)
}

// Función para actualizar los datos de fotos o videos
export async function updateMediaData(mediaType: "photos" | "videos", newData: any) {
  // Esta es una función de ejemplo que en un entorno real
  // actualizaría los archivos JSON o una base de datos

  // En una implementación real, aquí se escribiría en el archivo JSON
  // o se haría una llamada a una API para actualizar los datos

  console.log(`Actualizando datos de ${mediaType}:`, newData)

  // Simulamos una operación asíncrona
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: `Datos de ${mediaType} actualizados correctamente` })
    }, 500)
  })
}

// Agregar esta función al final del archivo
export function getTeamLogo(teamId: string): string {
  // Check if we have a custom logo for this team
  const customLogos: Record<string, string> = {
    "generacion-kabob": "/images/teams/kabod.png",
    mekadesh: "/images/teams/mekadesh.png",
    anonymous: "/images/teams/anonymous.png",
    shekinah: "/images/teams/shekinah.png",
  }

  if (customLogos[teamId]) {
    return customLogos[teamId]
  }

  // Otherwise use a placeholder
  return `/placeholder.svg?height=200&width=200`
}

