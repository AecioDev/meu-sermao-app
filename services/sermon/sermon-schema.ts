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
  title: string;
  explanation: string;
  scriptureReferences: string[];
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
