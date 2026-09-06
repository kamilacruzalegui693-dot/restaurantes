import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return NextResponse.json(
      { success: false, message: "Error al cerrar sesión" },
      { status: 500 }
    );
  }
}
