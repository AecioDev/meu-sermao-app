// frontend/src/components/dashboard/RecentSermons.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Clock, BookOpen, ArrowRight, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Sermon } from "@/services/sermon/sermon-schema";

// 1. Nossos helpers de estilo (copiados do seu arquivo)
const serviceTypeLabels = {
  missoes: "Missões",
  ensino: "Ensino",
  adoracao: "Adoração",
  avivamento: "Avivamento",
  santa_ceia: "Santa Ceia",
  acao_de_gracas: "Ação de Graças",
  juventude: "Juventude",
  familia: "Família",
  evangelismo: "Evangelismo",
  oracao: "Oração",
};

const serviceTypeColors = {
  missoes: "bg-blue-100 text-blue-800",
  ensino: "bg-green-100 text-green-800",
  adoracao: "bg-purple-100 text-purple-800",
  avivamento: "bg-red-100 text-red-800",
  santa_ceia: "bg-amber-100 text-amber-800",
  acao_de_gracas: "bg-orange-100 text-orange-800",
  juventude: "bg-cyan-100 text-cyan-800",
  familia: "bg-pink-100 text-pink-800",
  evangelismo: "bg-lime-100 text-lime-800",
  oracao: "bg-indigo-100 text-indigo-800",
};

interface RecentSermonsProps {
  sermons: Sermon[];
  isLoading: boolean;
}

export default function RecentSermons({
  sermons,
  isLoading,
}: RecentSermonsProps) {
  if (isLoading) {
    return (
      <Card className="border-none shadow-lg py-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
            Sermões Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 md:h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sermons.length === 0) {
    return (
      <Card className="border-none shadow-lg py-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-6 h-6 text-indigo-600" />
            Sermões Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum sermão ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Comece criando seu primeiro sermão inspirador!
            </p>
            <Link href="/criar-sermao">
              <Button className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-primary-foreground">
                <BookOpen className="w-4 h-4 mr-2" />
                Criar Primeiro Sermão
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="w-6 h-6 text-indigo-600" />
          Sermões Recentes
        </CardTitle>
        <Link href="/biblioteca">
          <Button
            variant="ghost"
            size="sm"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sermons.map((sermon) => (
            <Link key={sermon.id} href={`/biblioteca?sermon=${sermon.id}`}>
              <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer border hover:border-indigo-300">
                {" "}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {" "}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={serviceTypeColors[sermon.serviceType]}
                        >
                          {serviceTypeLabels[sermon.serviceType]}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                        {" "}
                        {sermon.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {sermon.theme}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(
                          new Date(sermon.createdAt),
                          "d 'de' MMMM 'às' HH:mm",
                          { locale: ptBR }
                        )}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />{" "}
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
