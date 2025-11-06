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
  deleteSermon,
  updateSermon,
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
 * Hook customizado (Mutation) para ATUALIZAR um sermão (ex: favoritar).
 * Usa uma atualização otimista para o UX ser instantâneo.
 */

type UpdateSermonContext = {
  previousSermons: Sermon[] | undefined;
};

export const useUpdateSermon = (
  options: UseMutationOptions<
    Sermon,
    Error,
    { id: string } & Partial<Sermon>,
    UpdateSermonContext
  > = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Sermon,
    Error,
    { id: string } & Partial<Sermon>,
    UpdateSermonContext
  >({
    mutationFn: updateSermon,

    onMutate: async (updatedSermon) => {
      await queryClient.cancelQueries({ queryKey: sermonsQueryKey });
      const previousSermons =
        queryClient.getQueryData<Sermon[]>(sermonsQueryKey);

      queryClient.setQueryData<Sermon[]>(sermonsQueryKey, (oldSermons = []) =>
        oldSermons.map((sermon) =>
          sermon.id === updatedSermon.id
            ? { ...sermon, ...updatedSermon }
            : sermon
        )
      );

      return { previousSermons };
    },

    onError: (err, variables, context, mutation) => {
      if (context?.previousSermons) {
        queryClient.setQueryData(sermonsQueryKey, context.previousSermons);
      }
      options.onError?.(err, variables, context, mutation);
    },

    onSettled: (data, error, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: sermonsQueryKey });
      options.onSettled?.(data, error, variables, context, mutation);
    },
    ...options,
  });
};

/**
 * Hook customizado (Mutation) para deletar um sermão.
 * Invalida o cache da lista de sermões ('sermons') após o sucesso.
 */
export const useDeleteSermon = (
  options: UseMutationOptions<void, Error, string> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteSermon,
    onSuccess: (data, sermonId, context, mutation) => {
      // Invalida a query principal da biblioteca
      queryClient.invalidateQueries({ queryKey: sermonsQueryKey });

      // Opcional: remover da query individual se você tiver uma
      // queryClient.removeQueries({ queryKey: [...sermonsQueryKey, 'detail', sermonId] });

      options.onSuccess?.(data, sermonId, context, mutation);
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
