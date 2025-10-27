// services/auth/auth-schema.ts

// Tipo para os dados enviados no registro
export type RegisterData = {
  fullName: string;
  email: string;
  password: string;
};

// Tipo para os dados enviados no login
export type LoginData = {
  email: string;
  password: string;
};

// (Poderíamos definir o tipo de resposta do registro,
// mas ele retorna o User, que já temos em user-schema.ts)
