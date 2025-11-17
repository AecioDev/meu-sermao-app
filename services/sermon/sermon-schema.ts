// services/sermons/sermon-schema.ts
import { ServiceType } from "@/generated/client";

// =================================
// TIPOS DO CRUD BÁSICO
// =================================

// Tipo principal do Sermão (como vem do DB)
export type Sermon = {
  id: string;
  serviceType: ServiceType;
  theme: string;
  title: string;
  keyVerse: string | null;
  introduction: string | null;
  conclusion: string | null;
  notes: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  // O Prisma tem `mainPoints`, mas a API de GET /api/sermons não retorna por padrão
  // Vamos adicionar aqui o tipo que a IA vai gerar
  mainPoints?: MainPoint[];
};

// Tipo do Ponto Principal (igual ao do JSON da IA)
export type MainPoint = {
  id?: string;
  title: string;
  explanation: string;
  scriptureReferences: string[];
  order?: number; // Opcional
};

// =================================
// NOVOS TIPOS PARA O FLUXO DA IA
// =================================

// --- ETAPA 1: Sugerir Temas ---

/**
 * O que o frontend envia para a rota /suggest-themes
 */
export type GenerateThemePayload = {
  serviceType: ServiceType;
};

/**
 * O formato de cada sugestão de tema que a IA retorna
 */
export type ThemeSuggestion = {
  theme: string;
  description: string;
  key_verse: string;
};

/**
 * A resposta completa da rota /suggest-themes
 */
export type GenerateThemeResponse = {
  themes: ThemeSuggestion[];
};

// --- ETAPA 2: Gerar Sermão Completo ---

/**
 * O que o frontend envia para a rota /generate-full
 */
export type GenerateFullSermonPayload = {
  serviceType: ServiceType;
  theme: string;
  keyVerse: string;
};

/**
 * A resposta completa da rota /generate-full (o esboço)
 */
export type GenerateFullSermonResponse = {
  title: string;
  introduction: string;
  mainPoints: MainPoint[];
  conclusion: string;
};

// =================================
// CONSTANTES DE EXIBIÇÃO
// =================================

/**
 * Mapeia as chaves do ServiceType para labels amigáveis.
 * Centralizado aqui para ser usado em toda a aplicação.
 */
export const serviceTypeLabels: Record<ServiceType, string> = {
  missoes: "Missões",
  ensino: "Ensino",
  adoracao: "Adoração",
  avivamento: "Avivamento",
  santa_ceia: "Santa Ceia",
  acao_de_gracas: "Ação de Graças",
  juventude: "Juventude",
  familia: "Família",
  evangelismo: "Evangelismo",
  oracao: "Oração",
};

/**
 * Mapeia as chaves do ServiceType para classes de cor do Tailwind.
 * Centralizado aqui para ser usado em toda a aplicação.
 */
export const serviceTypeColors: Record<ServiceType, string> = {
  missoes: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  ensino: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  adoracao:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  avivamento: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  santa_ceia:
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  acao_de_gracas:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  juventude: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  familia: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  evangelismo: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
  oracao:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
};
