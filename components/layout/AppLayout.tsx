// components/layout/AppLayout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

// Imports dos componentes ShadCN
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// **NÃO PRECISAMOS MAIS DO SHEET!**
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Importa o nosso menu flutuante
import { BottomNavBar } from "./BottomNavBar";

// Imports dos Ícones
import {
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  Library,
  Crown,
  LogOut,
  // CreditCard, (Não estamos usando ainda)
  // Menu, (Não estamos usando mais)
} from "lucide-react";

// ---
// 1. CONTEÚDO DA SIDEBAR (Sem mudanças, continua ótimo)
// ---
const SidebarContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const mockUser = { full_name: "Amigo G.", plan: "free" };
  const isPremium = mockUser.plan === "premium";

  const navigationItems = [
    { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
    { title: "Criar Sermão", url: "/criar-sermao", icon: PlusCircle },
    { title: "Biblioteca", url: "/biblioteca", icon: Library },
  ];

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <>
      {/* Header (Logo) */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Meu Sermão
            </h2>
          </div>
        </div>
      </div>

      {/* Content (Menu) */}
      <div className="flex-1 p-3 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
          Navegação
        </p>
        <nav className="flex flex-col gap-1">
          {navigationItems.map((item) => (
            <Button
              key={item.title}
              asChild
              variant={pathname === item.url ? "default" : "ghost"}
              className={`w-full justify-start gap-3 px-4 py-3 ${
                pathname === item.url
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:text-white"
                  : "hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <Link href={item.url}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      {/* Footer (User) */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">
              {mockUser.full_name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">
              {mockUser.full_name || "Usuário"}
            </p>
            {isPremium ? (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 text-xs">
                <Crown className="w-3 h-3 mr-1" /> Premium
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                Grátis
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </>
  );
};

// ---
// 2. O COMPONENTE PRINCIPAL DO LAYOUT (COM O BOTTOM NAV)
// ---
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // Div principal: TRAVADO na altura da tela e sem rolagem
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* 1. Sidebar do Desktop (Escondida no Mobile) */}
      <aside className="w-72 h-full hidden md:flex md:flex-col border-r border-border bg-card">
        <SidebarContent />
      </aside>

      {/* 2. Conteúdo Principal */}
      <main className="flex-1 flex flex-col h-screen">
        {/* 3. CONTEÚDO ROLÁVEL */}
        {/* No mobile, ele precisa de um 'padding-bottom' (pb-20) 
          para o conteúdo não ficar ESCONDIDO atrás da BottomNavBar.
        */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/30 pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* 4. NOSSO NOVO MENU FLUTUANTE (Só aparece no mobile) */}
      <BottomNavBar />
    </div>
  );
}
