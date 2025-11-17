import { MainPoint, PrismaClient } from "@/generated/client";
import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Atualiza um sermão (Simples ou Completo com MainPoints)
 * Rota: PATCH /api/sermons/[id]
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const { user, error, status } = await getAuthUser(request);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const { id } = params as { id: string };
    const body = await request.json();

    // Validação de posse (mantida)
    const sermon = await prisma.sermon.findFirst({
      where: { id, userId: user?.id },
    });

    if (!sermon) {
      return NextResponse.json(
        { error: "Sermão não encontrado" },
        { status: 404 }
      );
    }

    // --- NOVA LÓGICA DE ATUALIZAÇÃO ---

    // Separa os 'mainPoints' do resto do 'body'
    const { mainPoints, ...sermonData } = body;

    // Se o frontend ENVIAR um array de mainPoints, nós o substituímos.
    if (mainPoints && Array.isArray(mainPoints)) {
      // Usamos uma transação para deletar os antigos e criar os novos
      const transaction = await prisma.$transaction([
        // 1. Deleta todos os mainPoints antigos deste sermão
        prisma.mainPoint.deleteMany({
          where: { sermonId: id },
        }),

        // 2. Atualiza os dados principais E recria os mainPoints
        prisma.sermon.update({
          where: { id: id },
          data: {
            ...sermonData, // Atualiza title, notes, etc.
            mainPoints: {
              create: mainPoints.map((point: MainPoint, index: number) => ({
                title: point.title,
                explanation: point.explanation,
                scriptureReferences: point.scriptureReferences || [],
                order: index + 1, // Mantém a ordem correta
              })),
            },
          },
          include: {
            mainPoints: { orderBy: { order: "asc" } },
          },
        }),
      ]);

      // Retorna o sermão atualizado (resultado da segunda operação da transação)
      return NextResponse.json(transaction[1]);
    } else {
      // Se NÃO vierem mainPoints, fazemos a atualização simples (favoritar, etc.)
      const updatedSermon = await prisma.sermon.update({
        where: { id: id },
        data: sermonData, // Atualiza só o que veio
      });
      return NextResponse.json(updatedSermon);
    }
  } catch (error) {
    console.error("Erro ao atualizar sermão:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * Deleta um sermão
 * Rota: DELETE /api/sermons/[id]
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const { user, error, status } = await getAuthUser(request);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const { id } = params as { id: string };

    // Validação (mantida)
    const sermon = await prisma.sermon.findFirst({
      where: { id, userId: user?.id },
    });

    if (!sermon) {
      return NextResponse.json(
        { error: "Sermão não encontrado" },
        { status: 404 }
      );
    }

    // Deleção (mantida)
    await prisma.sermon.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Sermão deletado" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar sermão:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
