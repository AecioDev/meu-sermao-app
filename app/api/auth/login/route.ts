// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/client";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose"; // <--- Biblioteca para criar o token

const prisma = new PrismaClient();

// Função para criar o "cookie de sessão" (JWT)
async function createSessionToken(userId: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // O 'payload' é o que a gente guarda DENTRO do cookie
  // Vamos guardar só o ID do usuário
  const payload = {
    userId: userId,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d") // Cookie vale por 1 dia
    .sign(secret);

  return token;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validação básica
    if (!email || !password) {
      return new NextResponse("Email e senha são obrigatórios", {
        status: 400,
      });
    }

    // 2. Acha o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return new NextResponse("Credenciais inválidas", { status: 401 }); // 401 = Não autorizado
    }

    // 3. Compara a senha enviada com a senha "hash" do banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return new NextResponse("Credenciais inválidas", { status: 401 });
    }

    // 4. Se tudo deu certo, cria o token de sessão (o cookie)
    const token = await createSessionToken(user.id);

    // 5. Cria a resposta PRIMEIRO
    const response = new NextResponse("Login bem-sucedido!", {
      status: 200,
    });

    // 6. Seta o cookie NA RESPOSTA
    response.cookies.set("session_token", token, {
      httpOnly: true, // O cookie não pode ser lido por JavaScript no front
      secure: process.env.NODE_ENV === "production", // Só HTTPS em produção
      maxAge: 60 * 60 * 24 * 1, // 1 dia
      path: "/", // O cookie vale para o site inteiro
    });

    // 7. Retorna a resposta que agora contém o cookie
    return response;
  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
