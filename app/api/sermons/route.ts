// app/api/sermons/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, ServiceType } from "@/generated/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { getAuthUser } from "@/lib/auth";

const prisma = new PrismaClient();

// --- GET Handler: Buscar Sermões ---
export async function GET(request: Request) {
  try {
    const { user, error, status } = await getAuthUser(request);
    if (error) {
      return NextResponse.json({ error }, { status });
    }
    // Se chegou aqui, 'user' não é nulo e está logado!

    // 2. Busca os sermões
    const sermons = await prisma.sermon.findMany({
      where: { userId: user?.id },
      orderBy: { createdAt: "desc" },
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
    if (error) {
      return NextResponse.json({ error }, { status });
    }
    // Se chegou aqui, 'user' não é nulo e está logado!
    const userId = user?.id;

    // 2. Pega o Body
    const body = await request.json();
    const {
      title,
      theme,
      serviceType,
      keyVerse,
      introduction,
      conclusion,
      notes,
      // mainPoints serão tratados em outra rota ou aqui mesmo
    } = body;

    // 3. Validação
    if (!title || !theme || !serviceType) {
      return new NextResponse("Título, Tema e Tipo de Culto são obrigatórios", {
        status: 400,
      });
    }

    if (!Object.values(ServiceType).includes(serviceType)) {
      return new NextResponse("Tipo de Culto inválido", { status: 400 });
    }

    // 4. Cria o sermão no banco (Usando o userId do helper)
    const newSermon = await prisma.sermon.create({
      data: {
        userId: userId || "", // <-- ID seguro vindo do helper
        title: title,
        theme: theme,
        serviceType: serviceType,
        keyVerse: keyVerse || null,
        introduction: introduction || null,
        conclusion: conclusion || null,
        notes: notes || null,
        // mainPoints serão criados separadamente
      },
    });

    // 5. Retorna o sermão (Igual)
    // =================================
    return NextResponse.json(newSermon, { status: 201 }); // 201 = Created
  } catch (error) {
    console.error("ERRO EM /api/sermons (POST):", error);
    if (error instanceof PrismaClientValidationError) {
      return new NextResponse("Erro de validação nos dados enviados", {
        status: 400,
      });
    }
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
