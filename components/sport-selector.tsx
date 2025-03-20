"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getAllSports, type Sport } from "@/lib/sports-utils"

interface SportSelectorProps {
  currentSport: string
  onChange?: (sportId: string) => void
}

export default function SportSelector({ currentSport, onChange }: SportSelectorProps) {
  const [sports, setSports] = useState<Sport[]>([])
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const loadedSports = getAllSports()
    setSports(loadedSports)

    const current = loadedSports.find((sport) => sport.id === currentSport)
    if (current) {
      setSelectedSport(current)
    } else if (loadedSports.length > 0) {
      setSelectedSport(loadedSports[0])
    }
  }, [currentSport])

  const handleSportChange = (sportId: string) => {
    // Actualizar el estado local
    const sport = sports.find((s) => s.id === sportId)
    if (sport) {
      setSelectedSport(sport)
    }

    // Llamar al callback si existe
    if (onChange) {
      onChange(sportId)
    } else {
      // Si no hay callback, actualizar la URL
      const params = new URLSearchParams(searchParams.toString())
      params.set("sport", sportId)
      router.push(`${pathname}?${params.toString()}`)
    }
  }

  if (!selectedSport) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          {selectedSport.name}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sports.map((sport) => (
          <DropdownMenuItem
            key={sport.id}
            className="flex items-center justify-between"
            onClick={() => handleSportChange(sport.id)}
          >
            <div className="flex items-center">{sport.name}</div>
            {sport.id === selectedSport.id && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

