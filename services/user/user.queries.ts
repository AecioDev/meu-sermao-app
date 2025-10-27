// services/user/user.queries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "./user-requests";
import { User } from "./user-schema";

// Chave única para o cache do usuário logado
export const currentUserQueryKey = ["currentUser"];

/**
 * Hook customizado para buscar os dados do usuário logado.
 * Gerencia o estado de loading, erro e os dados do usuário.
 */
export const useCurrentUser = () => {
  return useQuery<User, Error>({
    // Tipa o retorno e o erro
    queryKey: currentUserQueryKey,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1, // Tenta buscar 1 vez em caso de erro
    // (Poderíamos adicionar onError aqui para deslogar se der 401)
  });
};
