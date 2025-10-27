// frontend/src/pages/Dashboard.tsx
"use client";

import { motion } from "framer-motion";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import PremiumBanner from "@/components/dashboard/PremiumBanner";
import StatsCards from "@/components/dashboard/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentSermons from "@/components/dashboard/RecentSermons";
import { useCurrentUser } from "@/services/user/user.queries";
import { useSermons } from "@/services/sermon/sermon.queries";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const { data: sermonsData, isLoading: isLoadingSermons } = useSermons();

  const allSermons = sermonsData || [];
  const recentSermons = allSermons.slice(0, 5);

  const sermonsThisMonth = user?.sermons_this_month ?? 0;
  const isPremium = user?.plan === "premium";
  const remaining = isPremium ? "∞" : Math.max(0, 3 - sermonsThisMonth);

  const isLoading = isLoadingUser || isLoadingSermons;

  // Mostra Skeleton para os componentes que dependem dos dados
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-[150px] w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[118px] w-full rounded-lg" />
          <Skeleton className="h-[118px] w-full rounded-lg" />
          <Skeleton className="h-[118px] w-full rounded-lg" />
        </div>
        <Skeleton className="h-[180px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    );
  }

  if (!user) {
    return <div>Erro ao carregar dados do usuário.</div>;
  }

  return (
    <div className="min-h-screen p-3 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeCard user={user} isPremium={isPremium} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatsCards
            totalSermons={allSermons.length}
            sermonsThisMonth={sermonsThisMonth}
            remaining={remaining}
            isPremium={isPremium}
          />
        </motion.div>

        {!isPremium && <PremiumBanner />}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <QuickActions isPremium={isPremium} remaining={remaining} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <RecentSermons sermons={recentSermons} isLoading={isLoadingSermons} />
        </motion.div>
      </div>
    </div>
  );
}
