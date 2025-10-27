// services/sermons/sermon-schema.ts

// Reutiliza o enum do Prisma (ou define aqui se preferir)
import { ServiceType } from "@/generated/client";

// Define o tipo do Sermão retornado pela API /api/sermons
export type Sermon = {
  id: string;
  serviceType: ServiceType; // Usa o enum importado
  theme: string;
  title: string;
  keyVerse: string | null;
  introduction: string | null;
  conclusion: string | null;
  notes: string | null;
  isFavorite: boolean;
  createdAt: string; // Vem como string ISO da API
  updatedAt: string; // Vem como string ISO da API
  userId: string;
  // mainPoints não está sendo retornado pela API GET por enquanto
};

// (Quando adicionar Zod)
// import { z } from 'zod';
// export const SermonSchema = z.object({ ... });
