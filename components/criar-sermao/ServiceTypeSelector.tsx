// components/criar-sermao/ServiceTypeSelector.tsx
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe,
  BookOpen,
  Music,
  Flame,
  Wine,
  Heart,
  Users,
  Home,
  MessageCircle,
  HandHeart,
} from "lucide-react";
import { motion } from "framer-motion";
import { ServiceType } from "@/generated/client";

// Define os tipos de culto usando o Enum
const serviceTypes: {
  id: ServiceType;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    id: "missoes",
    label: "Missões",
    icon: Globe,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "ensino",
    label: "Ensino",
    icon: BookOpen,
    color: "from-green-500 to-green-600",
  },
  {
    id: "adoracao",
    label: "Adoração",
    icon: Music,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "avivamento",
    label: "Avivamento",
    icon: Flame,
    color: "from-red-500 to-red-600",
  },
  {
    id: "santa_ceia",
    label: "Santa Ceia",
    icon: Wine,
    color: "from-amber-500 to-amber-600",
  },
  {
    id: "acao_de_gracas",
    label: "Ação de Graças",
    icon: Heart,
    color: "from-pink-500 to-pink-600",
  },
  {
    id: "juventude",
    label: "Juventude",
    icon: Users,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: "familia",
    label: "Família",
    icon: Home,
    color: "from-teal-500 to-teal-600",
  },
  {
    id: "evangelismo",
    label: "Evangelismo",
    icon: MessageCircle,
    color: "from-lime-500 to-lime-600",
  },
  {
    id: "oracao",
    label: "Oração",
    icon: HandHeart,
    color: "from-indigo-500 to-indigo-600",
  },
];

interface ServiceTypeSelectorProps {
  onSelect: (serviceType: ServiceType) => void;
}

export default function ServiceTypeSelector({
  onSelect,
}: ServiceTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {serviceTypes.map((type, index) => (
        <motion.div
          key={type.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-300"
            onClick={() => onSelect(type.id)}
          >
            <CardContent className="p-6 text-center">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br ${type.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <type.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {type.label}
              </h3>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
