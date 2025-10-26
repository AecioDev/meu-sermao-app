// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, password } = body;

    // 1. Validação básica de entrada
    if (!email || !fullName || !password) {
      return new NextResponse("Por favor, preencha todos os campos", {
        status: 400,
      });
    }

    // 2. Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return new NextResponse("Este e-mail já está em uso", { status: 409 }); // 409 = Conflito
    }

    // 3. Criptografa a senha (NUNCA salve a senha pura!)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Cria o usuário no banco
    const newUser = await prisma.user.create({
      data: {
        email: email,
        full_name: fullName,
        password: hashedPassword,
        plan: "free", // Novo usuário começa como 'free'
        // O 'last_reset_date' já tem @default(now()) no schema
      },
    });

    // 5. Responde sem a senha
    // (Boa prática não retornar a senha, mesmo criptografada)
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 = Criado
  } catch (error) {
    console.error("ERRO NO REGISTRO:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
