// components/layout/BottomNavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 1. Nossos itens de navegação (simplificados)
const navItems = [
  {
    href: "/dashboard",
    icon: "mdi:home-variant",
    label: "Painel",
  },
  {
    href: "/biblioteca",
    icon: "mdi:bookshelf",
    label: "Biblioteca",
  },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      {/* 2. Div que fica fixa no rodapé (só aparece no mobile: 'md:hidden') */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-20 pointer-events-none">
        <div className="mx-auto h-full w-full pointer-events-auto">
          {/* Botão de Ação Central (Criar Sermão) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  size="icon"
                  className="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  <Link href="/criar-sermao">
                    <Icon icon="mdi:plus" className="h-8 w-8" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="mb-2">
                <p>Criar Novo Sermão</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* 3. A barra de navegação */}
          <nav className="grid h-full w-full grid-cols-2 items-center rounded-t-2xl border-t bg-card">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors",
                    isActive && "text-primary font-bold"
                  )}
                >
                  <Icon icon={item.icon} className="h-6 w-6" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </TooltipProvider>
  );
}
