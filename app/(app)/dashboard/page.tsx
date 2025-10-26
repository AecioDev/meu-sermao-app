// frontend/src/pages/Dashboard.tsx
"use client";

import { motion } from "framer-motion";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import PremiumBanner from "@/components/dashboard/PremiumBanner";
import StatsCards from "@/components/dashboard/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentSermons from "@/components/dashboard/RecentSermons";

const mockUser = {
  full_name: "Amigo G.",
  plan: "free",
  sermons_this_month: 1,
};
const mockSermons = [
  {
    id: 1,
    title: "A Parábola do Semeador",
    theme: "Fé e Perseverança",
    service_type: "ensino" as const,
    created_date: new Date().toISOString(),
  },
  {
    id: 2,
    title: "O Bom Samaritano",
    theme: "Amor ao Próximo",
    service_type: "adoracao" as const,
    created_date: new Date(Date.now() - 86400000).toISOString(),
  },
];
const mockAllSermons = mockSermons;

const isLoading = false;

export default function Dashboard() {
  const isPremium = mockUser.plan === "premium";
  const sermonsThisMonth = mockUser.sermons_this_month;
  const remaining = isPremium ? "∞" : Math.max(0, 3 - sermonsThisMonth);

  return (
    <div className="min-h-screen p-3 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeCard user={mockUser} isPremium={isPremium} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatsCards
            totalSermons={mockAllSermons.length}
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
          <RecentSermons sermons={mockSermons} isLoading={isLoading} />
        </motion.div>
      </div>
    </div>
  );
}
