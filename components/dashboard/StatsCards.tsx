// frontend/src/components/dashboard/StatsCards.tsx

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Zap } from "lucide-react";

// Tipando as props (Boa prática com TypeScript)
interface StatsCardsProps {
  totalSermons: number;
  sermonsThisMonth: number;
  remaining: number | string; // Pode ser um número ou "∞"
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
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Este Mês",
      value: sermonsThisMonth,
      icon: Calendar,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Restantes",
      value: remaining,
      icon: Zap,
      color: isPremium
        ? "from-amber-500 to-orange-600"
        : "from-purple-500 to-purple-600",
      bgColor: isPremium ? "bg-amber-50" : "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div
            className={`absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 ${stat.bgColor} rounded-full blur-3xl opacity-50 transform translate-x-10 -translate-y-10 md:translate-x-16 md:-translate-y-16`}
          />
          <CardContent className="p-3 md:p-6 relative">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-0">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">
                  <span className="md:hidden">{stat.title}</span>
                  <span className="hidden md:inline">{stat.title}</span>
                </p>
                <p className="text-2xl md:text-4xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg self-end md:self-auto`}
              >
                <stat.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
