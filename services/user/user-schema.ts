// services/user/user-schema.ts

// Define o tipo Plan baseado no enum do Prisma
export type Plan = "free" | "premium";

// Define o tipo do Usuário retornado pela API /api/auth/me
export type User = {
  id: string;
  email: string;
  full_name: string;
  plan: Plan;
  sermons_this_month: number;
  last_reset_date: string; // Vem como string ISO da API
  createdAt: string; // Vem como string ISO da API
  updatedAt: string; // Vem como string ISO da API
};

// (Quando a gente adicionar Zod, vamos criar o schema aqui)
// import { z } from 'zod';
// export const UserSchema = z.object({ ... });
