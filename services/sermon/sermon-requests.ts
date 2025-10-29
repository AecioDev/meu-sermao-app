// services/sermons/sermon-requests.ts
import axios from "axios";
import {
  Sermon,
  GenerateThemePayload,
  GenerateThemeResponse,
  GenerateFullSermonPayload,
  GenerateFullSermonResponse,
} from "./sermon-schema";

// =================================
// FUNÇÕES DO CRUD BÁSICO
// =================================

/**
 * Busca a lista de sermões do usuário logado na API /api/sermons.
 */
export const fetchSermons = async (): Promise<Sermon[]> => {
  try {
    const { data } = await axios.get<Sermon[]>("/api/sermoes");
    return data;
  } catch (error) {
    console.error("Erro ao buscar sermões:", error);
    throw error;
  }
};

/**
 * Cria um novo sermão (SALVA NO DB) na API POST /api/sermons.
 */
export const createSermon = async (data: Partial<Sermon>): Promise<Sermon> => {
  try {
    const response = await axios.post<Sermon>("/api/sermoes", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar sermão:", error);
    throw error;
  }
};

// =================================
// NOVAS FUNÇÕES PARA A IA
// =================================

/**
 * ETAPA 1: Envia o tipo de culto e recebe sugestões de tema.
 */
export const generateThemeSuggestions = async (
  payload: GenerateThemePayload
): Promise<GenerateThemeResponse> => {
  try {
    const response = await axios.post<GenerateThemeResponse>(
      "/api/sermoes/suggest-themes",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao gerar sugestões de temas:", error);
    throw error;
  }
};

/**
 * ETAPA 2: Envia o tema escolhido e recebe o esboço completo.
 */
export const generateFullSermon = async (
  payload: GenerateFullSermonPayload
): Promise<GenerateFullSermonResponse> => {
  try {
    const response = await axios.post<GenerateFullSermonResponse>(
      "/api/sermoes/generate-full",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao gerar esboço completo:", error);
    throw error;
  }
};
