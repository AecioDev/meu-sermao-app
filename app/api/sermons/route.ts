// app/api/sermons/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient, ServiceType } from "@/generated/client";
import { jwtVerify } from "jose";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Função auxiliar para verificar o token (igual a das outras APIs)
async function verifyToken(token: string) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não está definido no .env");
  }
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload; // Retorna o payload com userId
  } catch (error) {
    console.error("ERRO: ", error);
    return null;
  }
}

// --- GET Handler: Buscar Sermões ---
export async function GET() {
  try {
    // 1. Pega o token do cookie (com await, como descobrimos)
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
      return new NextResponse("Não autorizado: Token não encontrado", {
        status: 401,
      });
    }

    // 2. Valida o token e pega o userId
    const payload = await verifyToken(token);
    if (!payload || !payload.userId || typeof payload.userId !== "string") {
      return new NextResponse("Não autorizado: Token inválido", {
        status: 401,
      });
    }
    const userId = payload.userId;

    // 3. Busca os sermões NO BANCO para AQUELE usuário
    const sermons = await prisma.sermon.findMany({
      where: {
        userId: userId, // Filtra pelo usuário logado
      },
      orderBy: {
        createdAt: "desc", // Ordena pelos mais recentes primeiro
      },
      // (Opcional: incluir os 'mainPoints' se precisar deles na lista)
      // include: { mainPoints: true }
    });

    // 4. Retorna a lista de sermões
    return NextResponse.json(sermons);
  } catch (error) {
    console.error("ERRO EM /api/sermons (GET):", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

// --- POST Handler: Criar Sermão ---
export async function POST(request: Request) {
  try {
    // 1. Pega o token do cookie e valida o usuário
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
      return new NextResponse("Não autorizado: Token não encontrado", {
        status: 401,
      });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.userId || typeof payload.userId !== "string") {
      return new NextResponse("Não autorizado: Token inválido", {
        status: 401,
      });
    }
    const userId = payload.userId;

    // 2. Lê os dados do corpo da requisição
    const body = await request.json();
    const {
      title,
      theme,
      serviceType,
      keyVerse,
      introduction,
      conclusion,
      notes,
      // mainPoints virão depois, talvez em outra rota ou aqui mesmo
    } = body;

    // 3. Validação básica dos campos obrigatórios (conforme schema.prisma)
    if (!title || !theme || !serviceType) {
      return new NextResponse("Título, Tema e Tipo de Culto são obrigatórios", {
        status: 400,
      });
    }

    // Validação extra para garantir que o serviceType é válido (opcional, o Prisma já faz)
    if (!Object.values(ServiceType).includes(serviceType)) {
      return new NextResponse("Tipo de Culto inválido", { status: 400 });
    }

    // 4. Cria o sermão no banco de dados usando Prisma
    const newSermon = await prisma.sermon.create({
      data: {
        userId: userId,
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

    // 5. Retorna o sermão recém-criado
    return NextResponse.json(newSermon, { status: 201 }); // 201 = Created
  } catch (error) {
    console.error("ERRO EM /api/sermons (POST):", error);
    // Verifica se é um erro conhecido do Prisma (ex: tipo inválido)
    if (error instanceof PrismaClientValidationError) {
      return new NextResponse(`Erro de validação: ${error.message}`, {
        status: 400,
      });
    }
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
