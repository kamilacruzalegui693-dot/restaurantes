import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// Verify admin session helper
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");
  const expectedToken = process.env.ADMIN_SECRET_TOKEN || "gastroguide_admin_secret_token_2026";
  return sessionCookie && sessionCookie.value === expectedToken;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: "Se requieren permisos de administrador" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID de reserva inválido" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("gastroguide");

    const result = await db.collection("reservations").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Estado de reserva actualizado" });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json({ error: "Error al actualizar reserva" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: "Se requieren permisos de administrador" }, { status: 401 });
    }

    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID de reserva inválido" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("gastroguide");

    const result = await db.collection("reservations").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Reserva eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json({ error: "Error al eliminar reserva" }, { status: 500 });
  }
}
