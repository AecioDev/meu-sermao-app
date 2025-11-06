// app/biblioteca/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { SermonCard } from "@/components/biblioteca/SermonCard";
import { SermonDetails } from "@/components/biblioteca/SermonDetails";
import { EmptyState } from "@/components/biblioteca/EmptyState";
import {
  useSermons,
  useDeleteSermon,
  useUpdateSermon,
} from "@/services/sermon/sermon.queries";
import type { Sermon } from "@/services/sermon/sermon-schema";
import { serviceTypeLabels } from "@/services/sermon/sermon-schema";
import { ServiceType } from "@/generated/client";
import { useCurrentUser } from "@/services/user/user.queries";

export default function BibliotecaPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ServiceType | "all">("all");
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const { data: sermons = [], isLoading: isLoadingSermons } = useSermons();

  const isPremium = user?.plan === "premium";

  const deleteSermon = useDeleteSermon({
    onSuccess: () => {
      setShowDetails(false);
    },
  });

  const updateSermon = useUpdateSermon({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sermonId = urlParams.get("sermon");
    if (sermonId && sermons.length > 0) {
      const sermon = sermons.find((s) => s.id === sermonId);
      if (sermon) {
        setSelectedSermon(sermon);
        setShowDetails(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sermons]);

  const filteredSermons = sermons.filter((sermon) => {
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sermon.keyVerse ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || sermon.serviceType === filterType;
    return matchesSearch && matchesFilter;
  });

  const displayedSermons = isPremium
    ? filteredSermons
    : filteredSermons.slice(0, 3);

  const handleViewSermon = (sermon: Sermon) => {
    if (!isPremium && !displayedSermons.includes(sermon)) {
      setShowUpgradeDialog(true);
      return;
    }
    setSelectedSermon(sermon);
    setShowDetails(true);
  };

  const handleCopySermon = (sermon: Sermon) => {
    const content = `
Título: ${sermon.title}
Tema: ${sermon.theme}
Versículo-Chave: ${sermon.keyVerse}

Introdução:
${sermon.introduction}

Pontos Principais:
${sermon.mainPoints
  ?.map(
    (point, i) =>
      `${i + 1}. ${point.title}\n${
        point.explanation
      }\nReferências: ${point.scriptureReferences.join(", ")}`
  )
  .join("\n\n")}

Conclusão:
${sermon.conclusion}

Notas:
${sermon.notes ?? "Nenhuma"}
    `.trim();
    navigator.clipboard.writeText(content);
  };

  const handleDeleteSermon = (id: string) => {
    deleteSermon.mutate(id);
  };

  const handleToggleFavorite = (sermon: Sermon) => {
    updateSermon.mutate({ id: sermon.id, isFavorite: !sermon.isFavorite });
  };

  const isLoading = isLoadingUser || isLoadingSermons;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Biblioteca de Sermões
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize e acesse todos os seus sermões
          </p>
        </div>
        <Link href="/criar-sermao">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Criar Sermão
          </Button>
        </Link>
      </header>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou tema..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filterType}
          onValueChange={(v: ServiceType | "all") => setFilterType(v)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {Object.entries(serviceTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Sermões */}
      {displayedSermons.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {displayedSermons.map((sermon, index) => (
              <motion.div
                key={sermon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <SermonCard
                  sermon={sermon}
                  onView={() => handleViewSermon(sermon)}
                  onCopy={() => handleCopySermon(sermon)}
                  onDelete={() => handleDeleteSermon(sermon.id)}
                  onToggleFavorite={() => handleToggleFavorite(sermon)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Diálogo de Detalhes */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20">
          <DialogTitle className="sr-only">
            Detalhes do Sermão: {selectedSermon?.title}
          </DialogTitle>

          {selectedSermon && (
            <SermonDetails
              sermon={selectedSermon}
              onClose={() => setShowDetails(false)}
              onCopy={() => handleCopySermon(selectedSermon)}
              onDelete={() => handleDeleteSermon(selectedSermon.id)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Upgrade */}
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conteúdo Premium</AlertDialogTitle>
            <AlertDialogDescription>
              Usuários do plano grátis têm acesso apenas aos{" "}
              <strong>3 sermões mais recentes</strong>.<br />
              Faça upgrade para Premium e tenha acesso{" "}
              <strong>ilimitado</strong> a todos os seus sermões, além de poder
              criar quantos quiser!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/pricing">Ver Planos Premium</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
