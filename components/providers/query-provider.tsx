// components/providers/query-provider.tsx
"use client"; // Precisa ser cliente porque o QueryClient é gerenciado no lado do cliente

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Cria uma única instância do QueryClient para todo o app
// Usamos useState para garantir que ele só seja criado uma vez no cliente
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Opções padrão que você pode querer:
        // staleTime: 60 * 1000, // 1 minuto até os dados serem considerados "velhos"
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: sempre cria um novo cliente
    return makeQueryClient();
  } else {
    // Browser: usa o cliente existente ou cria um novo
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Pega o QueryClient (ou cria se não existir)
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
