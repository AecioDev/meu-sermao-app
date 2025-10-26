// app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Bate na nossa API de Login
      await axios.post("/api/auth/login", formData);

      // 2. Se deu certo, o cookie foi setado!
      // A gente só precisa mandar o usuário para o dashboard.
      // O middleware vai ver o cookie e liberar.
      router.push("/dashboard");

      // (O ideal é dar um router.refresh() também para recarregar
      // os dados do servidor, mas vamos fazer isso depois)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        // A nossa API de Login manda "Credenciais inválidas"
        setError(err.response.data);
      } else {
        console.error("Erro inesperado no login:", err);
        setError("Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      {" "}
      {/* Mobile-first */}
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Meu Sermão</h1>
        </div>
        <CardTitle className="text-2xl">Acesse sua Conta</CardTitle>
        <CardDescription>Bem-vindo de volta!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Crie uma agora
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
