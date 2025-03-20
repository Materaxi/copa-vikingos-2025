import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")
  const folder = searchParams.get("folder") || "general"

  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
  }

  // Crear un nombre de archivo seguro con el folder
  const safePath = `${folder}/${Date.now()}-${filename}`

  try {
    const blob = await put(safePath, file, { access: "public" })

    return NextResponse.json({
      url: blob.url,
      success: true,
    })
  } catch (error) {
    console.error("Error al subir el archivo:", error)
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 })
  }
}

