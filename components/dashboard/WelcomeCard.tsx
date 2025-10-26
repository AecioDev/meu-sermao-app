// frontend/src/components/dashboard/WelcomeCard.tsx
import { Card } from "@/components/ui/card";
import { Sparkles, Crown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// 1. Tipando as props (Boa prática com TypeScript)
interface WelcomeCardProps {
  user: any; // Vamos usar 'any' por enquanto
  isPremium: boolean;
}

export default function WelcomeCard({ user, isPremium }: WelcomeCardProps) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <Card className="relative overflow-hidden border-none shadow-xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700">
      <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16 md:translate-x-32 md:-translate-y-32" />
      <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-12 translate-y-12 md:-translate-x-24 md:translate-y-24" />

      <div className="relative p-4 md:p-10">
        <div className="flex items-start justify-between mb-3 md:mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-amber-300 shrink-0" />
              <span className="text-white/90 text-xs md:text-sm font-medium truncate">
                {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
            <h1 className="text-xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              {greeting()}, {user?.full_name?.split(" ")[0] || "Pastor"}! 👋
            </h1>
            <p className="text-blue-100 text-sm md:text-lg">
              Prepare sermões inspiradores com IA
            </p>
          </div>
          {isPremium && (
            <div className="flex items-center gap-1.5 md:gap-2 bg-white/20 backdrop-blur-sm px-2 md:px-4 py-1 md:py-2 rounded-full shrink-0 ml-2">
              <Crown className="w-3 h-3 md:w-5 md:h-5 text-amber-300" />
              <span className="text-white font-semibold text-xs md:text-sm">
                Premium
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
