"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

export default function UploadPage() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<"image" | "video">("image")
  const [folder, setFolder] = useState("gallery")
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // Campos para metadatos
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [matchId, setMatchId] = useState("")
  const [sportId, setSportId] = useState("futbol")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    // Crear una URL para previsualización
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // Limpiar la URL cuando el componente se desmonte
    return () => URL.revokeObjectURL(objectUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&folder=${folder}`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al subir el archivo")
      }

      const data = await response.json()
      setUploadedUrl(data.url)

      toast({
        title: "Éxito",
        description: "Archivo subido correctamente",
      })

      // Aquí podrías implementar la lógica para guardar los metadatos
      // en tu archivo JSON o base de datos
      console.log({
        url: data.url,
        title,
        description,
        matchId,
        sportId,
        type: fileType,
        date: new Date().toISOString().split("T")[0],
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al subir el archivo",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Sube y gestiona archivos multimedia</p>
        </div>
        <Link href="/">
          <Button variant="outline">Volver al sitio</Button>
        </Link>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Subir Archivos</TabsTrigger>
          <TabsTrigger value="manage">Gestionar Archivos</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Subir Nuevo Archivo</CardTitle>
              <CardDescription>Sube imágenes o videos para el sitio de Copa Vikingos</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Tipo de Archivo</Label>
                  <Select value={fileType} onValueChange={(value) => setFileType(value as "image" | "video")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de archivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Imagen</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Carpeta</Label>
                  <Select value={folder} onValueChange={setFolder}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la carpeta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gallery">Galería</SelectItem>
                      <SelectItem value="teams">Equipos</SelectItem>
                      <SelectItem value="matches">Partidos</SelectItem>
                      <SelectItem value="videos">Videos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Deporte</Label>
                  <Select value={sportId} onValueChange={setSportId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el deporte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="futbol">Fútbol</SelectItem>
                      <SelectItem value="voley">Vóley</SelectItem>
                      <SelectItem value="futbol-damas">Fútbol Damas</SelectItem>
                      <SelectItem value="basquet">Básquet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del archivo" />
                </div>

                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del archivo"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>ID del Partido (opcional)</Label>
                  <Input value={matchId} onChange={(e) => setMatchId(e.target.value)} placeholder="Ej: match-1" />
                </div>

                <div className="space-y-2">
                  <Label>Seleccionar Archivo</Label>
                  <Input
                    type="file"
                    accept={fileType === "image" ? "image/*" : "video/*"}
                    onChange={handleFileChange}
                  />
                </div>

                {preview && fileType === "image" && (
                  <div className="mt-4 border rounded-md overflow-hidden">
                    <div className="relative h-[200px]">
                      <Image src={preview || "/placeholder.svg"} alt="Vista previa" fill className="object-contain" />
                    </div>
                  </div>
                )}

                {preview && fileType === "video" && (
                  <div className="mt-4 border rounded-md overflow-hidden">
                    <video src={preview} controls className="w-full h-[200px] object-contain" />
                  </div>
                )}

                <Button type="submit" disabled={!file || uploading} className="w-full">
                  {uploading ? "Subiendo..." : "Subir Archivo"}
                </Button>

                {uploadedUrl && (
                  <div className="mt-4 p-4 border rounded-md bg-muted">
                    <p className="font-medium">Archivo subido correctamente:</p>
                    <p className="text-sm text-muted-foreground break-all mt-1">{uploadedUrl}</p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(uploadedUrl)
                          toast({
                            title: "Copiado",
                            description: "URL copiada al portapapeles",
                          })
                        }}
                      >
                        Copiar URL
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                          Ver archivo
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Gestionar Archivos</CardTitle>
              <CardDescription>Administra los archivos multimedia existentes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Esta funcionalidad estará disponible próximamente. Aquí podrás ver, editar y eliminar los archivos
                subidos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

