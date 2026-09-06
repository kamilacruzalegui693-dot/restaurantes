import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");

    const expectedToken = process.env.ADMIN_SECRET_TOKEN || "gastroguide_admin_secret_token_2026";
    const expectedUser = process.env.ADMIN_USERNAME || "admin";

    if (sessionCookie && sessionCookie.value === expectedToken) {
      return NextResponse.json({
        authenticated: true,
        username: expectedUser,
      });
    }

    return NextResponse.json({
      authenticated: false,
    });
  } catch (error) {
    console.error("Error comprobando sesión:", error);
    return NextResponse.json(
      { authenticated: false, message: "Error al consultar sesión" },
      { status: 500 }
    );
  }
}
