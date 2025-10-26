// frontend/src/components/dashboard/PremiumBanner.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PremiumBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16 md:translate-x-32 md:-translate-y-32" />
        <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-12 translate-y-12 md:-translate-x-24 md:translate-y-24" />

        <CardContent className="relative p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4 flex-1 w-full">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-200" />
                  <h3 className="text-lg md:text-2xl font-bold text-white">
                    Desbloqueie o Premium
                  </h3>
                </div>
                <p className="text-white/90 text-xs md:text-base">
                  <strong>Sermões ilimitados</strong> por apenas{" "}
                  <strong>R$ 29,90/mês</strong>
                </p>
              </div>
            </div>

            <Link href={"/pricing"} className="w-full md:w-auto">
              <Button
                size="lg"
                className="w-full md:w-auto bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-xl group"
              >
                <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:animate-pulse" />
                <span className="hidden sm:inline">Assinar Premium</span>
                <span className="sm:hidden">Assinar</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
