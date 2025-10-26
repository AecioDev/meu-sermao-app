// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Cria a resposta de "logout OK"
    const response = new NextResponse("Deslogado com sucesso!", {
      status: 200,
    });

    // 2. Seta o cookie para "expirar" imediatamente
    response.cookies.set("session_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // <-- O truque é esse: 0 segundos de vida
      path: "/",
    });

    // 3. Retorna a resposta que vai limpar o cookie
    return response;
  } catch (error) {
    console.error("ERRO NO LOGOUT:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
