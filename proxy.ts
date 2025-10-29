// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session_token")?.value;

  // 2. Tenta validar o token para saber se o usuário está logado
  // A função verifyToken agora vem do helper 'lib/jwt.ts'
  const isLogged = token ? await verifyToken(token) : null;

  // --- DEFINIÇÃO DAS NOSSAS ROTAS ---

  // Rotas públicas (que qualquer um pode ver)
  const isPublicAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/pricing"); // Adicionei pricing só como exemplo

  // Rotas privadas (só logado pode ver)
  const isPrivateRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/biblioteca") || // Exemplo
    pathname.startsWith("/criar-sermao"); // Exemplo

  // --- LÓGICA DO "GUARDA-COSTAS" ---

  // CENÁRIO 1: Não está logado e tenta acessar rota privada
  if (!isLogged && isPrivateRoute) {
    // Joga para a página de login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // CENÁRIO 2: Está logado e tenta acessar rota pública de auth (ou a raiz)
  if (isLogged && (isPublicAuthRoute || pathname === "/")) {
    // Joga para o dashboard, pois já está logado
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // CENÁRIO 3: (Todos os outros casos)
  // Deixa o usuário passar.
  return NextResponse.next();
}

// 3. Configuração do "Matcher"
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (imagens otimizadas)
     * - favicon.ico (ícone)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
