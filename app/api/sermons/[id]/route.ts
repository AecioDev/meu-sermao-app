// app/api/sermons/[id]/route.ts
import { PrismaClient } from "@/generated/client";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Atualiza um sermão (ex: favoritar)
 * Rota: PATCH /api/sermons/[id]
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error, status } = await getAuthUser(request);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const { id } = params;
    const body = await request.json();

    // Validação para garantir que o usuário só atualize seus sermões
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

    const updatedSermon = await prisma.sermon.update({
      where: {
        id: id,
      },
      // Atualiza apenas os campos enviados no body (ex: { isFavorite: true })
      data: {
        title: body.title,
        theme: body.theme,
        keyVerse: body.keyVerse,
        introduction: body.introduction,
        conclusion: body.conclusion,
        notes: body.notes,
        isFavorite: body.isFavorite,
        serviceType: body.serviceType,
        // Não permita atualizar userId ou id
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error, status } = await getAuthUser(request);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const { id } = params;

    // Validação para garantir que o usuário só delete seus sermões
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

    await prisma.sermon.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Sermão excluído" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar sermão:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
