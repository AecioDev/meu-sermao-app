// src/app/api/sermons/route.ts

import { PrismaClient } from "@/generated/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const HARDCODED_USER_ID = "SEU_ID_DO_NEON_AQUI";

export async function GET() {
  try {
    const sermons = await prisma.sermon.findMany({
      where: { userId: HARDCODED_USER_ID },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sermons);
  } catch (error) {
    return new NextResponse("Erro ao buscar sermões", { status: 500 });
  }
}
