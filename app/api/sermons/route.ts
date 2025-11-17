// app/api/sermons/route.ts
import { NextResponse } from "next/server";
import { MainPoint, PrismaClient, ServiceType } from "@/generated/client";
import { getAuthUser } from "@/lib/auth";

const prisma = new PrismaClient();

// --- GET Handler: Buscar Sermões ---
export async function GET(request: Request) {
  try {
    const { user, error, status } = await getAuthUser(request);
    if (error || !user) {
      return NextResponse.json({ error }, { status });
    }

    const sermons = await prisma.sermon.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },

      include: {
        mainPoints: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(sermons);
  } catch (error) {
    console.error("ERRO EM /api/sermons (GET):", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

// --- POST Handler: Criar Sermão ---
export async function POST(request: Request) {
  try {
    const { user, error, status } = await getAuthUser(request);
    if (error || !user) {
      return NextResponse.json({ error }, { status });
    }

    const body = await request.json();

    console.log("Dados do Sermão na API: ", body);

    // Desestruturando mainPoints do body também
    const {
      title,
      theme,
      serviceType,
      keyVerse,
      introduction,
      conclusion,
      notes,
      mainPoints,
    } = body;

    // Validação básica
    if (!title || !theme || !serviceType) {
      return new NextResponse("Título, Tema e Tipo de Culto são obrigatórios", {
        status: 400,
      });
    }

    if (!Object.values(ServiceType).includes(serviceType)) {
      return new NextResponse("Tipo de Culto inválido", { status: 400 });
    }

    // Cria o sermão no banco COM OS PONTOS PRINCIPAIS (Nested Write)
    const newSermon = await prisma.sermon.create({
      data: {
        userId: user.id,
        title,
        theme,
        serviceType,
        keyVerse: keyVerse || null,
        introduction: introduction || null,
        conclusion: conclusion || null,
        notes: notes || null,
        // Aqui a mágica acontece: criamos os pontos juntos
        mainPoints: {
          create: (mainPoints as MainPoint[]).map((point, index) => ({
            title: point.title,
            explanation: point.explanation,
            scriptureReferences: point.scriptureReferences || [],
            order: index + 1,
          })),
        },
      },
      // Inclui os mainPoints na resposta
      include: {
        mainPoints: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(newSermon, { status: 201 });
  } catch (error) {
    console.error("ERRO EM /api/sermons (POST):", error);
    return new NextResponse("Erro interno ao criar sermão", { status: 500 });
  }
}
