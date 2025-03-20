import photosData from "@/data/photos.json"
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

