// frontend/src/layout/AppLayout.tsx

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  Library,
  Crown,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import axios from "axios";

// 1. DADOS MOCK (Substituindo base44.auth.me())
const mockUser = {
  full_name: "Amigo G.",
  plan: "free", // Mude para 'premium' para ver a diferença
};

// 2. Nossas rotas (Substituindo createPageUrl())
const navigationItems = [
  { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
  { title: "Criar Sermão", url: "/criar-sermao", icon: PlusCircle },
  { title: "Biblioteca", url: "/biblioteca", icon: Library },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPremium = mockUser.plan === "premium";

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");

      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 4. Esta é nossa SIDEBAR FALSA (substituindo o componente customizado) */}
      <aside className="w-72 border-r border-gray-200 bg-white/80 backdrop-blur-sm flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 p-6">
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
        <div className="flex-1 p-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            Navegação
          </p>
          <nav>
            {navigationItems.map((item) => (
              <Button
                key={item.title}
                asChild
                variant={pathname === item.url ? "default" : "ghost"}
                className={`w-full justify-start gap-3 px-4 py-3 mb-1 ${
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

          {/* TODO: Adicionar link "Minha Assinatura" */}
          {/* TODO: Adicionar banner "Upgrade para Premium" */}
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
                <Badge className="bg-linear-to-r from-amber-500 to-orange-600 text-white border-0 text-xs">
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
            className="w-full justify-start text-gray-600"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </aside>

      {/* 5. Este é o CONTEÚDO PRINCIPAL (Dashboard, etc.) */}
      <main className="flex-1 flex flex-col">
        {/* TODO: Adicionar header mobile */}
        <div className="flex-1 overflow-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
