// services/user/user-requests.ts
import axios from "axios";
import { User } from "./user-schema"; // Importa nosso tipo

/**
 * Busca os dados do usuário logado na API /api/auth/me.
 * Retorna os dados do usuário ou lança um erro se não autorizado.
 */
export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const { data } = await axios.get<User>("/api/auth/me");
    return data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    // Lança o erro para o React Query tratar (ele vai tentar de novo, etc.)
    throw error;
    // Não precisamos mais deslogar aqui, o React Query pode lidar com o erro 401
  }
};
