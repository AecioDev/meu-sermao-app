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
      <Card className="relative overflow-hidden border-none shadow-xl bg-linear-to-r from-amber-500 via-orange-600 to-red-600">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-24 translate-y-24" />

        <CardContent className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
                <Crown className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <h3 className="text-2xl font-bold text-white">
                    Desbloqueie o Poder Premium
                  </h3>
                </div>
                <p className="text-white/90 text-base">
                  Crie sermões <strong>ilimitados</strong>, exporte em PDF e
                  acesse recursos exclusivos por apenas{" "}
                  <strong>R$ 29,90/mês</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* MUDANÇA AQUI: 
                Trocamos createPageUrl("Pricing") por um link estático "/pricing" 
              */}
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-xl group"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Assinar Premium
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
