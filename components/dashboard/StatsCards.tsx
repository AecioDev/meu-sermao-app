// frontend/src/components/dashboard/StatsCards.tsx (Refatorado com cores FIXAS)

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Zap } from "lucide-react";

interface StatsCardsProps {
  totalSermons: number;
  sermonsThisMonth: number;
  remaining: number | string;
  isPremium: boolean;
}

export default function StatsCards({
  totalSermons,
  sermonsThisMonth,
  remaining,
  isPremium,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total de Sermões",
      value: totalSermons,
      icon: BookOpen,
      // --- ATUALIZADO ---
      // Cores fixas (hardcoded) que não mudam com o tema
      color: "bg-blue-500",
      iconColor: "text-white",
    },
    {
      title: "Este Mês",
      value: sermonsThisMonth,
      icon: Calendar,
      // --- ATUALIZADO ---
      color: "bg-indigo-500", // Cor do "accent" original
      iconColor: "text-white",
    },
    {
      title: "Restantes",
      value: remaining,
      icon: Zap,
      // --- ATUALIZADO ---
      // Lógica original de premium, mas com cores fixas
      color: isPremium
        ? "bg-amber-500" // Cor "premium" (como nas imagens)
        : "bg-purple-500", // Cor "não-premium"
      iconColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary"
        >
          {/* O blur de fundo ainda usa a cor do ícone, o que é um efeito legal */}
          <div
            className={`absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 ${stat.color} rounded-full blur-3xl opacity-50 transform translate-x-10 -translate-y-10 md:translate-x-16 md:-translate-y-16`}
          />
          <CardContent className="p-3 md:p-6 relative">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-0">
              <div className="flex-1">
                {/* Textos semânticos (mantido) */}
                <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                  <span className="md:hidden">{stat.title}</span>
                  <span className="hidden md:inline">{stat.title}</span>
                </p>
                <p className="text-2xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>

              {/* Icone com cor de fundo e cor de ícone fixas */}
              <div
                className={`w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center ${stat.color} ${stat.iconColor} shadow-lg`}
              >
                <stat.icon className="w-5 h-5 md:w-7 md:h-7" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
