// frontend/src/components/dashboard/QuickActions.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PlusCircle, Library, Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// 1. Tipando as props
interface QuickActionsProps {
  isPremium: boolean;
  remaining: number | string;
}

export default function QuickActions({
  isPremium,
  remaining,
}: QuickActionsProps) {
  const canCreateSermon =
    isPremium || (typeof remaining === "number" && remaining > 0);

  const actions = [
    {
      title: "Criar Novo Sermão",
      description: "Comece um novo sermão com ajuda da IA",
      icon: PlusCircle,
      gradient: "from-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      url: "/criar-sermao",
      disabled: !canCreateSermon,
    },
    {
      title: "Ver Biblioteca",
      description: "Acesse todos os seus sermões salvos",
      icon: Library,
      gradient: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
      url: "/sermon-library",
      disabled: false,
    },
  ];

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {!canCreateSermon && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-xs md:text-sm text-amber-800">
              Você atingiu o limite de sermões gratuitos este mês. Faça upgrade
              para Premium para continuar criando.
            </AlertDescription>
          </Alert>
        )}

        {/* Mobile: Lista Vertical Compacta */}
        <div className="flex md:hidden flex-col gap-2">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.url}
              className={
                action.disabled ? "pointer-events-none opacity-50" : ""
              }
            >
              <Card
                className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-${
                  action.gradient.split("-")[1]
                }-500 bg-linear-to-r ${action.bgGradient}`}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${action.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 mb-0.5 truncate">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Desktop: Grid Original */}
        <div className="hidden md:grid md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.url}
              className={
                action.disabled ? "pointer-events-none opacity-50" : ""
              }
            >
              <Card
                className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-${
                  action.gradient.split("-")[1]
                }-500 bg-linear-to-br ${action.bgGradient}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
