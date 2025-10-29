// app/api/sermons/generate-full/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { PrismaClient } from "@/generated/client";
import { generateFullSermon } from "@/lib/geminiService";

const prisma = new PrismaClient();

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

    // 3. Pega os dados do body
    const body = await request.json();
    const { serviceType, theme, keyVerse } = body;

    if (!serviceType || !theme || !keyVerse) {
      return NextResponse.json(
        { error: "Tipo de culto, tema e versículo são obrigatórios" },
        { status: 400 }
      );
    }

    // 4. Chama a IA para gerar o sermão completo
    const sermonOutline = await generateFullSermon(
      serviceType,
      theme,
      keyVerse
    );

    // 5. ATUALIZA A CONTAGEM DO USUÁRIO (só para 'free')
    if (!isPremium) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          sermons_this_month: {
            increment: 1,
          },
        },
      });
    }

    // 6. Retorna o sermão completo (em JSON)
    return NextResponse.json(sermonOutline);
  } catch (error) {
    console.error("ERRO EM /api/sermons/generate-full:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
