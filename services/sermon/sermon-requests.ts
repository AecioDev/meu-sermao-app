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
 * Busca a lista de sermões do usuário logado na API
 */
export const fetchSermons = async (): Promise<Sermon[]> => {
  try {
    const { data } = await axios.get<Sermon[]>("/api/sermons");
    return data;
  } catch (error) {
    console.error("Erro ao buscar sermões:", error);
    throw error;
  }
};

/**
 * Cria um novo sermão (SALVA NO DB) na API
 */
export const createSermon = async (data: Partial<Sermon>): Promise<Sermon> => {
  try {
    const response = await axios.post<Sermon>("/api/sermons", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar sermão:", error);
    throw error;
  }
};

/**
 * Atualiza um sermão (PATCH) na API
 */
export const updateSermon = async (
  payload: { id: string } & Partial<Sermon>
): Promise<Sermon> => {
  const { id, ...data } = payload;
  try {
    const response = await axios.patch<Sermon>(`/api/sermons/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar sermão:", error);
    throw error;
  }
};

/**
 * Deleta um sermão específico na API
 */
export const deleteSermon = async (sermonId: string): Promise<void> => {
  try {
    await axios.delete(`/api/sermons/${sermonId}`);
  } catch (error) {
    console.error("Erro ao deletar sermão:", error);
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
    console.log("Chama API");
    const response = await axios.post<GenerateThemeResponse>(
      "/api/sermons/suggest-themes",
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
    console.log("payload: ", payload);
    const response = await axios.post<GenerateFullSermonResponse>(
      "/api/sermons/generate-full",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao gerar esboço completo:", error);
    throw error;
  }
};
