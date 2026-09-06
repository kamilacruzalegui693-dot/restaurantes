import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const expectedUser = process.env.ADMIN_USERNAME || "admin";
    const expectedPass = process.env.ADMIN_PASSWORD || "adminpassword123";
    const secretToken = process.env.ADMIN_SECRET_TOKEN || "gastroguide_admin_secret_token_2026";

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    if (username.trim() !== expectedUser || password !== expectedPass) {
      return NextResponse.json(
        { success: false, message: "Credenciales de administración incorrectas" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", secretToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Sesión de administración iniciada con éxito",
      username: expectedUser,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { success: false, message: "Error interno en el servidor" },
      { status: 500 }
    );
  }
}
