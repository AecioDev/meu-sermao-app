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

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canCreateSermon && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Você atingiu o limite de sermões gratuitos este mês. Faça upgrade
              para Premium para continuar criando.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Link
            // 2. Link estático
            href="/criar-sermao"
            className={!canCreateSermon ? "pointer-events-none opacity-50" : ""}
          >
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 bg-linear-to-br from-blue-50 to-indigo-50">
              {" "}
              {/* 3. Gradiente corrigido */}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {" "}
                    {/* 3. Gradiente corrigido */}
                    <PlusCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      Criar Novo Sermão
                    </h3>
                    <p className="text-sm text-gray-600">
                      Comece um novo sermão com ajuda da IA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/biblioteca">
            {" "}
            {/* 2. Link estático */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-500 bg-linear-to-br from-purple-50 to-pink-50">
              {" "}
              {/* 3. Gradiente corrigido */}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {" "}
                    {/* 3. Gradiente corrigido */}
                    <Library className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      Ver Biblioteca
                    </h3>
                    <p className="text-sm text-gray-600">
                      Acesse todos os seus sermões salvos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
