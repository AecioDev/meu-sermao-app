// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // O getAuthUser já faz tudo: pega cookie, valida e busca no DB
    const { user, error, status } = await getAuthUser(request);

    // 2. Se deu erro, retorna o erro padronizado
    if (error) {
      // Usamos NextResponse.json para consistência
      return NextResponse.json({ error }, { status });
    }

    // 3. Se deu certo, retorna o usuário
    return NextResponse.json(user);
  } catch (error) {
    // Um catch genérico pra qualquer erro inesperado que o helper não pegou
    console.error("ERRO EM /api/auth/me:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
