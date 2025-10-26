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
import axios from "axios";
import Link from "next/link";
//import PixelTracking from "../components/tracking/PixelTracking";

const navigationItems = [
  {
    title: "Painel",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Criar Sermão",
    url: createPageUrl("CreateSermon"),
    icon: PlusCircle,
  },
  {
    title: "Biblioteca",
    url: createPageUrl("SermonLibrary"),
    icon: Library,
  },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  //   const { data: user } = useQuery({
  //     queryKey: ["currentUser"],
  //     queryFn: () => base44.auth.me(),
  //   });

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const user = { full_name: "Amigo G.", plan: "free" };
  const isPremium = user.plan === "premium";

  // Páginas que não devem ter sidebar (landing pages)
  const noSidebarPages = [createPageUrl("Pricing")];
  const shouldShowSidebar = !noSidebarPages.includes(pathname);

  // Se for página sem sidebar, renderiza apenas o conteúdo
  if (!shouldShowSidebar) {
    return (
      <>
        {/* <PixelTracking /> */}
        <div className="min-h-screen w-full">{children}</div>
      </>
    );
  }

  return (
    <SidebarProvider>
      {/* <PixelTracking /> */}
      <style>{`
        :root {
          --primary: #1e3a8a;
          --primary-light: #3b82f6;
          --accent: #6366f1;
          --gold: #f59e0b;
          --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar className="border-r border-gray-200 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Meu Sermão
                </h2>
                <p className="text-xs text-gray-500">Sermões inspiradores</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 ${
                          pathname === item.url
                            ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:text-white"
                            : ""
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

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Assinatura
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={`hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 rounded-xl ${
                        pathname === createPageUrl("ManageSubscription")
                          ? "bg-linear-to-r from-purple-600 to-pink-600 text-white hover:text-white"
                          : ""
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

            {!isPremium && (
              <div className="mx-3 my-4 p-4 bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-linear-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-800">
                      Upgrade para Premium
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 mb-3">
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

          <SidebarFooter className="border-t border-gray-100 p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">
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
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h1 className="text-lg font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Meu Sermão
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
