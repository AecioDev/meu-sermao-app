"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceType } from "@/generated/client";
import {
  GenerateFullSermonResponse,
  ThemeSuggestion,
} from "@/services/sermon/sermon-schema";
import {
  useCreateSermon,
  useGenerateFullSermon,
  useGenerateThemes,
} from "@/services/sermon/sermon.queries";

// Componentes de UI da Shadcn
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpenCheckIcon, Loader2, Sparkles } from "lucide-react";

// Componentes das Etapas
import ServiceTypeSelector from "@/components/criar-sermao/ServiceTypeSelector";
import ThemeSuggestions from "@/components/criar-sermao/ThemeSuggestions";
import SermonEditor from "@/components/criar-sermao/SermonEditor";

type Step = 1 | 2 | 3; // 1: Tipo, 2: Tema, 3: Editor

export default function CriarSermaoPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [apiError, setApiError] = useState<string | null>(null);

  // Armazena os dados entre as etapas
  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType | null>(null);
  const [suggestedThemes, setSuggestedThemes] = useState<ThemeSuggestion[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeSuggestion | null>(
    null
  );
  const [generatedSermon, setGeneratedSermon] =
    useState<GenerateFullSermonResponse | null>(null);

  // =================================================================
  // HOOKS (MUTATIONS)
  // =================================================================

  // ETAPA 1 -> 2: Gerar Temas
  const { mutate: generateThemes, isPending: isGeneratingThemes } =
    useGenerateThemes({
      onSuccess: (data) => {
        setApiError(null);
        setSuggestedThemes(data.themes);
        setStep(2);
      },
      onError: (error) => {
        setApiError(
          `Falha ao sugerir temas: ${error.message}. Tente novamente.`
        );
      },
    });

  // ETAPA 2 -> 3: Gerar Sermão Completo
  const { mutate: generateSermon, isPending: isGeneratingSermon } =
    useGenerateFullSermon({
      onSuccess: (data) => {
        setApiError(null);
        setGeneratedSermon(data);
        setStep(3);
      },
      onError: (error) => {
        setApiError(
          `Falha ao gerar o sermão: ${error.message}. Tente novamente.`
        );
      },
    });

  // ETAPA 3 -> Salvar: Salvar Sermão no Banco
  const { mutate: saveSermon, isPending: isSaving } = useCreateSermon({
    onSuccess: () => {
      setApiError(null);
      router.push("/dashboard"); // Ou para a página de "biblioteca"
    },
    onError: (error) => {
      setApiError(`Falha ao salvar o sermão: ${error.message}.`);
    },
  });

  // =================================================================
  // HANDLERS (Ações do Usuário)
  // =================================================================

  const handleServiceTypeSelect = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    generateThemes({ serviceType });
  };

  const handleThemeSelect = (theme: ThemeSuggestion) => {
    if (!selectedServiceType) return;
    setSelectedTheme(theme);
    console.log("Tema Selecionado: ", theme);
    generateSermon({
      serviceType: selectedServiceType,
      theme: theme.theme,
      keyVerse: theme.key_verse,
    });
  };

  const handleSermonSave = (sermonData: GenerateFullSermonResponse) => {
    if (!selectedServiceType || !selectedTheme) {
      setApiError("Erro interno: Tipo de culto ou tema não selecionados.");
      return;
    }

    // Monta o objeto final para salvar no banco
    const sermonToSave = {
      ...sermonData,
      serviceType: selectedServiceType,
      theme: selectedTheme.theme,
      keyVerse: selectedTheme.key_verse,
      // mainPoints já está em sermonData
    };

    console.log("Dados do Sermão: ", sermonToSave);

    saveSermon(sermonToSave);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setApiError(null);
      setSuggestedThemes([]);
    } else if (step === 3) {
      setStep(2);
      setApiError(null);
      setGeneratedSermon(null);
    }
  };

  // =================================================================
  // RENDERIZAÇÃO
  // =================================================================

  const isPending = isGeneratingThemes || isGeneratingSermon;

  const renderStep = () => {
    // 1. Estado de Carregamento (Global)
    if (isPending) {
      return (
        <Card className="shadow-lg animate-pulse">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-6 text-indigo-500 animate-spin" />
            <p className="text-xl font-semibold text-gray-800">
              {isGeneratingThemes
                ? "Buscando temas inspiradores..."
                : "Construindo seu esboço..."}
            </p>
            <p className="text-gray-500 mt-2">
              Nossa IA está trabalhando. Isso pode levar alguns segundos...
            </p>
          </CardContent>
        </Card>
      );
    }

    // 2. Renderiza a Etapa Atual
    switch (step) {
      case 1:
        return <ServiceTypeSelector onSelect={handleServiceTypeSelect} />;
      case 2:
        return (
          <ThemeSuggestions
            themes={suggestedThemes}
            onSelect={handleThemeSelect}
          />
        );
      case 3:
        if (generatedSermon) {
          return (
            <SermonEditor
              sermon={generatedSermon}
              onSave={handleSermonSave}
              isSaving={isSaving}
            />
          );
        }
        // Fallback caso algo dê errado
        setStep(1);
        setApiError("Erro ao carregar o editor. Tente novamente.");
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BookOpenCheckIcon className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Assistente de Sermão
            </h1>

            <p className="text-lg text-muted-foreground">
              Gere um esboço completo em 3 etapas fáceis.
            </p>
          </div>
        </div>
        {step > 1 && (
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isPending}
            className="shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        )}
      </div>

      {apiError && (
        <Alert variant="destructive">
          <Sparkles className="h-4 w-4" />
          <AlertTitle>Ocorreu um Erro</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <div className="transition-all duration-300">{renderStep()}</div>
    </div>
  );
}
