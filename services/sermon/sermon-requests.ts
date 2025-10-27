// services/sermons/sermon-requests.ts
import axios from "axios";
import { Sermon } from "./sermon-schema"; // Importa nosso tipo

/**
 * Busca a lista de sermões do usuário logado na API /api/sermons.
 * Retorna a lista de sermões ou lança um erro.
 */
export const fetchSermons = async (): Promise<Sermon[]> => {
  try {
    // A API retorna um array de Sermon
    const { data } = await axios.get<Sermon[]>("/api/sermons");
    return data;
  } catch (error) {
    console.error("Erro ao buscar sermões:", error);
    // Lança o erro para o React Query tratar
    throw error;
  }
};

/**
 * Cria um novo sermão na API POST /api/sermons.
 * @param data - Dados do novo sermão (pelo menos title, theme, serviceType).
 * @returns O sermão recém-criado.
 */
export const createSermon = async (data: Partial<Sermon>): Promise<Sermon> => {
  // Usamos Partial<Sermon> porque o frontend pode não enviar todos os campos
  try {
    const response = await axios.post<Sermon>("/api/sermons", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar sermão:", error);
    // Relança o erro para o React Query Mutation tratar
    throw error;
  }
};
