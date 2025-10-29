import { cookies } from "next/headers";
import { PrismaClient } from "@/generated/client";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

/**
 * Helper de autenticação completo para API Routes (Server-side Node.js).
 * Verifica o cookie, valida o token e busca o usuário no banco.
 * Retorna o usuário ou um objeto de erro com status.
 *
 * (Não funciona no Middleware/Edge por causa do Prisma)
 */
export async function getAuthUser(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
      return {
        user: null,
        error: "Não autorizado: Token não encontrado",
        status: 401,
      };
    }

    // Usando o helper de JWT centralizado
    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return {
        user: null,
        error: "Não autorizado: Token inválido",
        status: 401,
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        plan: true,
        sermons_this_month: true,
        full_name: true,
        email: true,
      },
    });

    if (!user) {
      return {
        user: null,
        error: "Não autorizado: Usuário não encontrado",
        status: 401,
      };
    }

    return { user, error: null, status: 200 };
  } catch (error) {
    console.error("[getAuthUser Helper] Erro:", error);
    return {
      user: null,
      error: "Erro interno do servidor ao autenticar.",
      status: 500,
    };
  }
}
