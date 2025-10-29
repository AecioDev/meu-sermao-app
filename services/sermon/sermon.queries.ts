// services/sermons/sermon.queries.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  createSermon,
  fetchSermons,
  generateThemeSuggestions,
  generateFullSermon,
} from "./sermon-requests";
import {
  Sermon,
  GenerateThemePayload,
  GenerateThemeResponse,
  GenerateFullSermonPayload,
  GenerateFullSermonResponse,
} from "./sermon-schema";

export const sermonsQueryKey = ["sermons"];

/**
 * Hook customizado para buscar a lista de sermões do usuário logado.
 */
export const useSermons = () => {
  return useQuery<Sermon[], Error>({
    queryKey: sermonsQueryKey,
    queryFn: fetchSermons,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook customizado (Mutation) para criar um novo sermão.
 * Invalida o cache da lista de sermões ('sermons') após o sucesso.
 */
export const useCreateSermon = (
  options: UseMutationOptions<Sermon, Error, Partial<Sermon>> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<Sermon, Error, Partial<Sermon>>({
    mutationFn: createSermon,
    onSuccess: (newSermon, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: sermonsQueryKey });
      options.onSuccess?.(newSermon, variables, context, mutation);
    },
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
    ...options,
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
    ...options,
  });
};
