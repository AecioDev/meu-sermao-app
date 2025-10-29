// components/criar-sermao/ThemeSuggestions.tsx
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeSuggestion } from "@/services/sermon/sermon-schema"; // Importa nosso tipo

interface ThemeSuggestionsProps {
  themes: ThemeSuggestion[];
  onSelect: (theme: ThemeSuggestion) => void;
}

export default function ThemeSuggestions({
  themes,
  onSelect,
}: ThemeSuggestionsProps) {
  return (
    <div className="space-y-4">
      {themes.map((theme, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-400"
            onClick={() => onSelect(theme)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {theme.key_verse}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {theme.theme}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {theme.description}
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
