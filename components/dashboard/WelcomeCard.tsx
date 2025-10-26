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
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-24 translate-y-24" />

      <div className="relative p-8 md:p-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-amber-300" />
              <span className="text-white/90 text-sm font-medium">
                {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {greeting()}, {user?.full_name?.split(" ")[0] || "Pastor"}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Prepare sermões inspiradores com a ajuda da inteligência
              artificial
            </p>
          </div>
          {isPremium && (
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Crown className="w-5 h-5 text-amber-300" />
              <span className="text-white font-semibold text-sm">Premium</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
