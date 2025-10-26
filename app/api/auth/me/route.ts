// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@/generated/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Função auxiliar para verificar o token (igual a do middleware)
async function verifyToken(token: string) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não está definido no .env");
  }
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    // Retorna o payload inteiro, que contém o userId
    return payload;
  } catch (error) {
    console.error("ERRO:", error);
    return null;
  }
}

export async function GET() {
  try {
    // 1. Pega o token do cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
      return new NextResponse("Não autorizado: Token não encontrado", {
        status: 401,
      });
    }

    // 2. Valida o token
    const payload = await verifyToken(token);

    if (!payload || !payload.userId || typeof payload.userId !== "string") {
      return new NextResponse("Não autorizado: Token inválido", {
        status: 401,
      });
    }

    // 3. Busca o usuário no banco usando o ID do token
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      // Seleciona SÓ os campos que a gente quer retornar (sem a senha!)
      select: {
        id: true,
        email: true,
        full_name: true,
        plan: true,
        sermons_this_month: true,
        last_reset_date: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      // Isso pode acontecer se o usuário foi deletado depois que o token foi criado
      return new NextResponse("Não autorizado: Usuário não encontrado", {
        status: 401,
      });
    }

    // 4. Retorna os dados do usuário (sem a senha)
    return NextResponse.json(user);
  } catch (error) {
    console.error("ERRO EM /api/auth/me:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
