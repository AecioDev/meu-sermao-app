// services/auth/auth-requests.ts
import axios from "axios";
import { RegisterData, LoginData } from "./auth-schema";
import { User } from "../user/user-schema";

/**
 * Registra um novo usuário.
 * Lança um erro se o email já existir ou ocorrer outro problema.
 * @param data - Dados do usuário para registro (nome, email, senha).
 * @returns Os dados do usuário criado (sem a senha).
 */
export const registerUser = async (
  data: RegisterData
): Promise<Omit<User, "password">> => {
  try {
    // Usamos Omit<User, 'password'> para indicar que a API não retorna a senha
    const response = await axios.post<Omit<User, "password">>(
      "/api/auth/register",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Erro no registro via request:", error);
    // Relança o erro para o componente tratar (mostrar mensagem, etc.)
    throw error;
  }
};

/**
 * Realiza o login do usuário.
 * Lança um erro se as credenciais forem inválidas.
 * @param data - Credenciais de login (email, senha).
 */
export const loginUser = async (data: LoginData): Promise<void> => {
  try {
    // A API de login retorna só status 200 e seta o cookie
    await axios.post("/api/auth/login", data);
    // Não precisa retornar nada, o cookie foi setado
  } catch (error) {
    console.error("Erro no login via request:", error);
    throw error;
  }
};

/**
 * Realiza o logout do usuário (limpa o cookie).
 * Lança um erro se ocorrer um problema.
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await axios.get("/api/auth/logout");
    // Não precisa retornar nada
  } catch (error) {
    console.error("Erro no logout via request:", error);
    throw error;
  }
};
