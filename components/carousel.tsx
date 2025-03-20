"use client"

import { useState, useEffect, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarouselProps {
  children: ReactNode[]
  autoPlay?: boolean
  interval?: number
  showControls?: boolean
  showIndicators?: boolean
}

export default function Carousel({
  children,
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? children.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === children.length - 1 ? 0 : prevIndex + 1))
  }

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      handleNext()
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, currentIndex, interval])

  // Pause autoplay when user interacts with controls
  const handleControlInteraction = (callback: () => void) => {
    setIsPlaying(false)
    callback()
    // Resume autoplay after a short delay
    setTimeout(() => setIsPlaying(autoPlay), 5000)
  }

  if (!isClient) {
    return <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg"></div>
  }

  if (children.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        No hay elementos para mostrar
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {children.map((child, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 1 : 0 }}
        >
          {child}
        </div>
      ))}

      {showControls && children.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 opacity-70 shadow-md hover:opacity-100"
            onClick={() => handleControlInteraction(handlePrevious)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 opacity-70 shadow-md hover:opacity-100"
            onClick={() => handleControlInteraction(handleNext)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Siguiente</span>
          </Button>
        </>
      )}

      {showIndicators && children.length > 1 && (
        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 space-x-1">
          {children.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-primary/30"}`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Ir a diapositiva ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

