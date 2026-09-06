import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo de imagen" }, { status: 400 });
    }

    // Clean filename and add timestamp
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${cleanName}`;

    // Upload to Vercel Blob under restaurants/ folder
    const blob = await put(`restaurants/${filename}`, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error en /api/upload:", error);
    return NextResponse.json(
      {
        error: "Error al subir la imagen a Vercel Blob. Asegúrate de configurar la variable BLOB_READ_WRITE_TOKEN en tu proyecto de Vercel.",
      },
      { status: 500 }
    );
  }
}
