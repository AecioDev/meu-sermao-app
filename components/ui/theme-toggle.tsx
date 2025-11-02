"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-11 w-24 items-center justify-center rounded-full bg-muted">
        <Icon icon="lucide:sun" className="h-6 w-6 text-primary" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-11 w-24 items-center rounded-full p-1",
        "bg-primary transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      aria-label={`Alternar para tema ${isDark ? "claro" : "escuro"}`}
    >
      {/* Fundo animado (azul ou índigo) */}
      <motion.div
        layoutId="theme-toggle-bg"
        className={cn(
          "absolute inset-1  flex items-center rounded-full px-2",
          isDark ? "bg-primary justify-end" : "bg-primary justify-start"
        )}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Icon
          icon={!isDark ? "lucide:moon" : "lucide:sun"}
          className={cn("h-5 w-5 transition-colors", "text-indigo-claro")}
        />
      </motion.div>

      {/* Thumb com ícone DENTRO */}
      <motion.div
        className={cn(
          "relative z-10 flex h-9 w-9 items-center justify-center rounded-full",
          "bg-card shadow-md ring-1 ring-border",
          "transition-colors"
        )}
        animate={{
          x: isDark ? 2 : 50, // 4px = left, 52px = right (w-24 - 2*padding - thumb)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Icon
          icon={isDark ? "lucide:moon" : "lucide:sun"}
          className={cn("h-5 w-5 transition-colors", "text-primary")}
        />
      </motion.div>
    </button>
  );
}
