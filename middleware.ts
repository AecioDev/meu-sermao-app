// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Importa o 'jose' para VERIFICAR o token

// 1. Chave secreta (TEM QUE SER A MESMA do seu .env)
const JWT_SECRET = process.env.JWT_SECRET;

// Função auxiliar para verificar o token
async function verifyToken(token: string) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não está definido no .env");
  }
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload;
  } catch (error) {
    // Se o token for inválido ou expirado, ele dá erro
    console.error("Erro: ", error);
    return null;
  }
}

// 2. O "AuthGuard" (Middleware)
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session_token")?.value;

  // 3. Tenta validar o token para saber se o usuário está logado
  const isLogged = token ? await verifyToken(token) : null;

  // --- DEFINIÇÃO DAS NOSSAS ROTAS ---

  // Rotas públicas (que qualquer um pode ver)
  const isPublicAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/pricing");

  // Rotas privadas (só logado pode ver)
  const isPrivateRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/biblioteca") ||
    pathname.startsWith("/criar-sermao");

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
  // (Ex: Não logado acessando /login, ou Logado acessando /dashboard)
  // Deixa o usuário passar.
  return NextResponse.next();
}

// 4. Configuração do "Matcher"
// Isso diz ao middleware em QUAIS rotas ele deve rodar.
// A gente quer que ele rode em TUDO, *exceto* em arquivos estáticos e da API.
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
