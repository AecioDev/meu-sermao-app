// services/sermons/sermon.queries.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions, // <-- 1. IMPORTAMOS O TIPO DE OPÇÕES
} from "@tanstack/react-query";
import {
  createSermon,
  fetchSermons,
  generateThemeSuggestions, // <-- Importa as novas funções
  generateFullSermon,
} from "./sermon-requests";
import {
  Sermon,
  GenerateThemePayload, // <-- Importa os novos tipos
  GenerateThemeResponse,
  GenerateFullSermonPayload,
  GenerateFullSermonResponse,
} from "./sermon-schema";

// Chave única para o cache da lista de sermões
export const sermonsQueryKey = ["sermons"];

/**
 * Hook customizado para buscar a lista de sermões do usuário logado.
 */
export const useSermons = () => {
  return useQuery<Sermon[], Error>({
    queryKey: sermonsQueryKey,
    queryFn: fetchSermons,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook customizado (Mutation) para criar um novo sermão.
 * Invalida o cache da lista de sermões ('sermons') após o sucesso.
 */
export const useCreateSermon = (
  // 2. ADICIONAMOS O PARÂMETRO DE OPÇÕES
  options: UseMutationOptions<Sermon, Error, Partial<Sermon>> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<Sermon, Error, Partial<Sermon>>({
    mutationFn: createSermon,
    onSuccess: (newSermon, variables, context, mutation) => {
      // <-- 1. ADICIONAMOS O 4º ARGUMENTO 'mutation'
      // Invalida o cache
      queryClient.invalidateQueries({ queryKey: sermonsQueryKey });
      // 3. CHAMA O ON_SUCCESS QUE O COMPONENTE PASSAR
      options.onSuccess?.(newSermon, variables, context, mutation);
    },
    // 4. REPASSA TODAS AS OUTRAS OPÇÕES (onError, etc)
    ...options,
  });
};

/**
 * Hook customizado (Mutation) para GERAR SUGESTÕES DE TEMAS.
 */
export const useGenerateThemes = (
  options: UseMutationOptions<
    GenerateThemeResponse,
    Error,
    GenerateThemePayload
  > = {}
) => {
  return useMutation<GenerateThemeResponse, Error, GenerateThemePayload>({
    mutationFn: generateThemeSuggestions,
    ...options, // Repassa todas as opções (onSuccess, onError, etc.)
  });
};

/**
 * Hook customizado (Mutation) para GERAR UM SERMÃO COMPLETO.
 */
export const useGenerateFullSermon = (
  options: UseMutationOptions<
    GenerateFullSermonResponse,
    Error,
    GenerateFullSermonPayload
  > = {}
) => {
  return useMutation<
    GenerateFullSermonResponse,
    Error,
    GenerateFullSermonPayload
  >({
    mutationFn: generateFullSermon,
    ...options, // Repassa todas as opções
  });
};
