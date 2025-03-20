"use client"

import { useState, useEffect } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface YouTubePlayerProps {
  videoId: string
  title: string
  thumbnail?: string
}

export default function YouTubePlayer({ videoId, title, thumbnail }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Función para extraer el ID de YouTube de una URL completa si es necesario
  const getYouTubeId = (idOrUrl: string) => {
    if (idOrUrl.includes("youtube.com") || idOrUrl.includes("youtu.be")) {
      const url = new URL(idOrUrl)
      if (idOrUrl.includes("youtube.com/watch")) {
        return url.searchParams.get("v") || idOrUrl
      } else if (idOrUrl.includes("youtu.be/")) {
        return url.pathname.substring(1)
      }
    }
    return idOrUrl // Si ya es un ID, devolver tal cual
  }

  const youtubeId = getYouTubeId(videoId)

  if (!isClient) {
    return (
      <div className="relative h-full w-full bg-black">
        {thumbnail ? (
          <div className="relative h-full w-full">
            <Image src={thumbnail || "/placeholder.svg"} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-full bg-background/20 backdrop-blur-sm"
              >
                <Play className="h-8 w-8 text-white" fill="white" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-full">
              <Play className="h-8 w-8" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (!isPlaying) {
    return (
      <div className="relative h-full w-full bg-black">
        {thumbnail ? (
          <div className="relative h-full w-full">
            <Image src={thumbnail || "/placeholder.svg"} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-full bg-background/20 backdrop-blur-sm"
                onClick={() => setIsPlaying(true)}
              >
                <Play className="h-8 w-8 text-white" fill="white" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-full" onClick={() => setIsPlaying(true)}>
              <Play className="h-8 w-8" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      ></iframe>
    </div>
  )
}

