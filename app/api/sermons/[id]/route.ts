import { PrismaClient } from "@/generated/client";
import { getAuthUser } from "@/lib/auth";
// 1. Importe o 'NextRequest' aqui
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Atualiza um sermão (ex: favoritar)
 * Rota: PATCH /api/sermons/[id]
 */
export async function PATCH(
  // 2. Mude de 'Request' para 'NextRequest'
  request: NextRequest,
  // 3. Mude a assinatura de 'params' para 'context'
  context: { params: { id: string } }
) {
  try {
    const { user, error, status } = await getAuthUser(request);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    // 4. Pegue o 'id' de 'context.params'
    const { id } = context.params;
    const body = await request.json();

    // Validação (seu código original, perfeito)
    const sermon = await prisma.sermon.findFirst({
      where: {
        id,
        userId: user?.id,
      },
    });

    if (!sermon) {
      return NextResponse.json(
        { error: "Sermão não encontrado" },
        { status: 404 }
      );
    }

    // Atualização (seu código original, perfeito)
    const updatedSermon = await prisma.sermon.update({
      where: {
        id: id,
      },
      data: {
        title: body.title,
        theme: body.theme,
        keyVerse: body.keyVerse,
        introduction: body.introduction,
        conclusion: body.conclusion,
        notes: body.notes,
        isFavorite: body.isFavorite,
        serviceType: body.serviceType,
      },
    });

    return NextResponse.json(updatedSermon);
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
export async function DELETE(
  // 5. Repita as mesmas mudanças aqui
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { user, error, status } = await getAuthUser(request);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    // 6. Pegue o 'id' de 'context.params'
    const { id } = context.params;

    // Validação (seu código original, perfeito)
    const sermon = await prisma.sermon.findFirst({
      where: {
        id,
        userId: user?.id,
      },
    });

    if (!sermon) {
      return NextResponse.json(
        { error: "Sermão não encontrado" },
        { status: 404 }
      );
    }

    // Deleção (seu código original, perfeito)
    await prisma.sermon.delete({
      where: {
        id: id,
      },
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
