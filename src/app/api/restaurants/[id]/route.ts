import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    const expectedToken = process.env.ADMIN_SECRET_TOKEN || "gastroguide_admin_secret_token_2026";

    if (!sessionCookie || sessionCookie.value !== expectedToken) {
      return NextResponse.json(
        { error: "No autorizado. Se requieren permisos de administración para eliminar restaurantes." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID de restaurante inválido" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("gastroguide");
    const collection = db.collection("restaurants");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Restaurante no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Restaurante eliminado correctamente" });
  } catch (error) {
    console.error("Database error in DELETE /api/restaurants/[id]:", error);
    return NextResponse.json({ error: "Fallo al eliminar restaurante" }, { status: 500 });
  }
}
