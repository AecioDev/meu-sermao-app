import { jwtVerify } from "jose";

// Tipagem para o payload do JWT
export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verifica um token JWT e retorna o payload.
 * Este helper funciona no Edge e no Node.js.
 */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não está definido no .env");
  }
  try {
    const { payload } = await jwtVerify<JwtPayload>(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload;
  } catch (error) {
    console.error("ERRO ao verificar token: ", error);
    return null;
  }
}
