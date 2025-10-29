import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/client";
import { generateSermonOutline } from "@/lib/geminiService";
import { getAuthUser } from "@/lib/auth";

const prisma = new PrismaClient();

// Limite do plano gratuito (do seu schema.prisma)
const FREE_PLAN_LIMIT = 3;

export async function POST(request: Request) {
  try {
    // 1. AUTENTICAÇÃO (Agora em uma linha!)
    const { user, error, status } = await getAuthUser(request);

    // Se deu erro na autenticação, só retorna o erro
    if (error) {
      return NextResponse.json({ error }, { status });
    }
    // Se chegou aqui, 'user' não é nulo e está logado!

    // 2. VALIDAÇÃO DO BODY
    const body = await request.json();
    const { theme, reference } = body;

    if (!theme) {
      return NextResponse.json(
        { error: "O campo 'theme' (tema) é obrigatório." },
        { status: 400 } // Bad Request
      );
    }

    // 3. LÓGICA DE NEGÓCIO (Rate Limiting do Plano)
    const isPremium = user?.plan === "premium";
    const sermonsThisMonth = user?.sermons_this_month ?? 0;

    if (!isPremium && sermonsThisMonth >= FREE_PLAN_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Você atingiu seu limite de 3 sermões/mês no plano gratuito. Considere fazer o upgrade para o plano Premium para gerações ilimitadas.",
        },
        { status: 403 }
      );
    }

    // 4. CHAMADA DA IA
    console.log(
      `[API Generate] Usuário ${user?.id} gerando para o tema: "${theme}"`
    );
    const outline = await generateSermonOutline(theme, reference);

    // 5. ATUALIZAR O BANCO DE DADOS
    if (!isPremium) {
      await prisma.user.update({
        where: { id: user?.id },
        data: {
          sermons_this_month: { increment: 1 },
        },
      });
    }

    // 6. SUCESSO
    return NextResponse.json({ outline });
  } catch (error) {
    console.error("[API Generate] Erro na rota:", error);

    // Tratar erros específicos do Gemini
    if (error instanceof Error && error.message.includes("Gemini")) {
      return NextResponse.json(
        { error: "Erro ao gerar o esboço com a IA." },
        { status: 503 } // Service Unavailable
      );
    }

    // Erro genérico
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 } // Internal Server Error
    );
  }
}
