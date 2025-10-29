// app/api/sermons/suggest-themes/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { generateThemeSuggestions } from "@/lib/geminiService";

export async function POST(request: Request) {
  try {
    // 1. Autenticação (Nosso helper!)
    const { user, error, status } = await getAuthUser(request);
    if (error || !user) {
      return NextResponse.json({ error }, { status });
    }

    // 2. Limite de Plano
    const isPremium = user.plan === "premium";
    const remaining = isPremium
      ? 1000
      : Math.max(0, 3 - user.sermons_this_month);

    if (remaining <= 0) {
      return NextResponse.json(
        { error: "Limite de gerações de IA atingido para este mês." },
        { status: 403 } // 403 Forbidden
      );
    }

    // 3. Pega o serviceType do body
    const body = await request.json();
    const { serviceType } = body;

    if (!serviceType) {
      return NextResponse.json(
        { error: "Tipo de culto é obrigatório" },
        { status: 400 }
      );
    }

    // 4. Chama a IA para sugerir temas
    const suggestions = await generateThemeSuggestions(serviceType);

    // 5. Retorna as sugestões
    // Não incrementamos a contagem aqui, só quando ele gera o sermão completo
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("ERRO EM /api/sermons/suggest-themes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
