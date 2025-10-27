// services/sermons/sermon.queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSermon, fetchSermons } from "./sermon-requests";
import { Sermon } from "./sermon-schema";

// Chave única para o cache da lista de sermões
export const sermonsQueryKey = ["sermons"];

/**
 * Hook customizado para buscar a lista de sermões do usuário logado.
 */
export const useSermons = () => {
  return useQuery<Sermon[], Error>({
    // Tipagem correta
    queryKey: sermonsQueryKey,
    queryFn: fetchSermons,
    staleTime: 5 * 60 * 1000, // 5 minutos
    // (Poderíamos adicionar placeholderData ou initialData se quiséssemos)
  });
};

/**
 * Hook customizado (Mutation) para criar um novo sermão.
 * Invalida o cache da lista de sermões ('sermons') após o sucesso.
 */
export const useCreateSermon = () => {
  const queryClient = useQueryClient(); // Pega o cliente do React Query

  return useMutation<Sermon, Error, Partial<Sermon>>({
    // <Retorno, Erro, Input>
    mutationFn: createSermon, // A função que será chamada
    onSuccess: (newSermon) => {
      // Quando a criação der certo:
      console.log("Sermão criado:", newSermon);

      // Invalida o cache da lista de sermões.
      // Isso força o React Query a buscar a lista de novo (com o novo sermão)
      // na próxima vez que o componente useSermons() for renderizado.
      queryClient.invalidateQueries({ queryKey: sermonsQueryKey });

      // Poderíamos também atualizar o cache manualmente aqui para ser mais rápido:
      // queryClient.setQueryData<Sermon[]>(sermonsQueryKey, (oldData) =>
      //   oldData ? [newSermon, ...oldData] : [newSermon]
      // );
    },
    onError: (error) => {
      // Opcional: Lidar com erros aqui (ex: mostrar notificação global)
      console.error("Erro ao criar sermão (Mutation):", error);
    },
  });
};
