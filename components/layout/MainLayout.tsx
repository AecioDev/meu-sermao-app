"use client";

import React from "react";
import {
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  Library,
  Crown,
  LogOut,
  Menu,
  CreditCard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useCurrentUser } from "@/services/user/user.queries";
import { logoutUser } from "@/services/auth/auth-requests";
import { ThemeToggle } from "../ui/theme-toggle";

const navigationItems = [
  { title: "Painel", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  {
    title: "Criar Sermão",
    url: createPageUrl("CreateSermon"),
    icon: PlusCircle,
  },
  { title: "Biblioteca", url: createPageUrl("SermonLibrary"), icon: Library },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: user, isLoading, error } = useCurrentUser();
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const isPremium = user?.plan === "premium";

  const noSidebarPages = [createPageUrl("Pricing")];
  const shouldShowSidebar = !noSidebarPages.includes(pathname);

  if (!shouldShowSidebar) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground">
        {children}
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <div className="border-b border-border p-4 bg-card/80 backdrop-blur-sm" />
        <div className="flex-1 p-3 overflow-y-auto" />
        <div className="border-t border-border p-4 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-2 mb-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 min-w-0 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
          <Skeleton className="h-8 w-full" />
        </div>
      </>
    );
  }

  if (error || !user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-linear-to-br from-background via-background to-muted/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        {/* SIDEBAR */}
        <Sidebar className="border-r border-border bg-card/80 backdrop-blur-sm shadow-sm rounded-r-2xl">
          <SidebarHeader className="border-b border-border p-6">
            <div className="flex items-center justify-between">
              {/* 2. Criamos um 'div' para agrupar o logo e o texto */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="flex-1 text-xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                    Meu Sermão
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Sermões inspiradores
                  </p>
                </div>
              </div>

              {/* 3. O ThemeToggle agora é "irmão" do grupo de logo, e não "filho" */}
              <ThemeToggle />
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            {/* Grupo Navegação */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`rounded-xl mb-1 transition-all duration-200 ${
                          pathname === item.url
                            ? "bg-linear-to-r from-primary to-accent text-primary-foreground shadow-md"
                            : "hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Grupo Assinatura */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                Assinatura
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={`rounded-xl transition-all duration-200 ${
                        pathname === createPageUrl("ManageSubscription")
                          ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-md"
                          : "hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Link
                        href={createPageUrl("ManageSubscription")}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="font-medium">Minha Assinatura</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Box Premium */}
            {!isPremium && (
              <div className="mx-3 my-4 p-4 bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-200/60 dark:border-amber-400/40 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-linear-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      Upgrade para Premium
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">
                      Sermões ilimitados e recursos avançados
                    </p>
                    <Link href={createPageUrl("Pricing")}>
                      <Button
                        size="sm"
                        className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md"
                      >
                        Ver Planos
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </SidebarContent>

          {/* Rodapé */}
          <SidebarFooter className="border-t border-border p-4 bg-card/80 backdrop-blur-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {user?.full_name || "Usuário"}
                  </p>
                  <div className="flex items-center gap-1">
                    {isPremium ? (
                      <Badge className="bg-linear-to-r from-amber-500 to-orange-600 text-white border-0 text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Grátis
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 flex flex-col">
          <header className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-muted/50 p-2 rounded-lg transition-colors duration-200">
                <Menu className="w-5 h-5 text-foreground" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  Meu Sermão
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-background text-foreground">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
